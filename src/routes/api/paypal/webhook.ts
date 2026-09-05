import { createFileRoute } from "@tanstack/react-router";
import {
  HANDLED_WEBHOOK_EVENTS,
  paypalConfigured,
  paypalWebhookId,
  readPayPalWebhookHeaders,
  summarizeWebhookEvent,
  verifyPayPalWebhook,
  type PayPalWebhookEvent,
} from "@/lib/paypal";

/**
 * In-memory dedupe of recent event ids (best-effort on serverless).
 * Survives warm isolates only — still safe because handlers are idempotent logs.
 */
const seen = new Map<string, number>();
const SEEN_TTL_MS = 24 * 60 * 60 * 1000;

function markSeen(eventId: string): boolean {
  const now = Date.now();
  for (const [k, t] of seen) {
    if (now - t > SEEN_TTL_MS) seen.delete(k);
  }
  if (!eventId) return false;
  if (seen.has(eventId)) return true;
  seen.set(eventId, now);
  return false;
}

async function handleEvent(event: PayPalWebhookEvent): Promise<void> {
  const summary = summarizeWebhookEvent(event);
  const { eventType, eventId } = summary;

  if (eventId && markSeen(eventId)) {
    console.info("[paypal-webhook] duplicate ignored", eventId);
    return;
  }

  // Structured log for Vercel / log drains — filter: [paypal-webhook]
  console.info(
    "[paypal-webhook]",
    JSON.stringify({
      ...summary,
      summaryText: event.summary,
      createTime: event.create_time,
    }),
  );

  switch (eventType) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      // Primary signal: money is in. Unlist Trade Me listing #{listingId}.
      console.info(
        "[paypal-sale]",
        JSON.stringify({
          action: "SOLD_UNLIST_ON_TRADEME",
          listingId: summary.listingId ?? null,
          captureId: summary.captureId ?? null,
          amount: summary.amount ?? null,
          currency: summary.currency ?? "NZD",
          shipping: summary.shipping ?? null,
        }),
      );
      break;
    }
    case "CHECKOUT.ORDER.APPROVED": {
      // Buyer approved; capture may already be done on return URL.
      console.info("[paypal-webhook] order approved", summary.orderId ?? eventId);
      break;
    }
    case "CHECKOUT.ORDER.COMPLETED": {
      console.info("[paypal-webhook] order completed", summary.orderId ?? eventId);
      break;
    }
    case "PAYMENT.CAPTURE.PENDING": {
      console.warn("[paypal-webhook] capture pending", summary);
      break;
    }
    case "PAYMENT.CAPTURE.DENIED":
    case "PAYMENT.CAPTURE.REFUNDED":
    case "PAYMENT.CAPTURE.REVERSED": {
      console.warn("[paypal-webhook] capture issue", eventType, summary);
      break;
    }
    default: {
      if (!HANDLED_WEBHOOK_EVENTS.has(eventType)) {
        console.info("[paypal-webhook] unhandled event type", eventType);
      }
    }
  }
}

export const Route = createFileRoute("/api/paypal/webhook")({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          ok: true,
          endpoint: "/api/paypal/webhook",
          webhookIdConfigured: Boolean(paypalWebhookId()),
          paypalConfigured: paypalConfigured(),
          subscribe: [
            "CHECKOUT.ORDER.APPROVED",
            "CHECKOUT.ORDER.COMPLETED",
            "PAYMENT.CAPTURE.COMPLETED",
            "PAYMENT.CAPTURE.DENIED",
            "PAYMENT.CAPTURE.PENDING",
            "PAYMENT.CAPTURE.REFUNDED",
            "PAYMENT.CAPTURE.REVERSED",
          ],
        }),

      POST: async ({ request }) => {
        if (!paypalConfigured()) {
          return Response.json({ error: "PayPal not configured" }, { status: 503 });
        }

        const raw = await request.text();
        let event: PayPalWebhookEvent;
        try {
          event = JSON.parse(raw) as PayPalWebhookEvent;
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const headers = readPayPalWebhookHeaders(request);
        if (!headers) {
          console.warn("[paypal-webhook] missing signature headers");
          return Response.json({ error: "Missing PayPal signature headers" }, { status: 400 });
        }

        if (!paypalWebhookId()) {
          console.error("[paypal-webhook] PAYPAL_WEBHOOK_ID not set — rejecting");
          return Response.json({ error: "Webhook id not configured" }, { status: 503 });
        }

        let verified = false;
        try {
          // Must pass the parsed object PayPal expects (same as body)
          verified = await verifyPayPalWebhook(headers, event);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "verify error";
          console.error("[paypal-webhook] verify threw", msg);
          return Response.json({ error: msg }, { status: 500 });
        }

        if (!verified) {
          console.warn("[paypal-webhook] signature verification FAILED");
          return Response.json({ error: "Invalid signature" }, { status: 401 });
        }

        try {
          await handleEvent(event);
        } catch (e) {
          // Still 200 so PayPal does not hammer retries for handler bugs;
          // we already logged. Re-throw only for catastrophic cases.
          console.error(
            "[paypal-webhook] handler error",
            e instanceof Error ? e.message : e,
          );
        }

        // Always acknowledge verified deliveries quickly
        return new Response(null, { status: 204 });
      },
    },
  },
});
