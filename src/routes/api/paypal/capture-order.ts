import { createFileRoute } from "@tanstack/react-router";
import { capturePayPalOrder, paypalConfigured } from "@/lib/paypal";

export const Route = createFileRoute("/api/paypal/capture-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!paypalConfigured()) {
          return Response.json({ error: "PayPal is not configured" }, { status: 503 });
        }

        let orderId = "";
        try {
          const body = (await request.json()) as { orderId?: string };
          orderId = String(body.orderId ?? "").trim();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        if (!orderId) {
          return Response.json({ error: "orderId required" }, { status: 400 });
        }

        try {
          const result = await capturePayPalOrder(orderId);
          console.info("[paypal] capture", JSON.stringify(result));
          // Seller flow: check PayPal email / Vercel logs, then unlist on Trade Me manually.
          return Response.json(result);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Capture failed";
          console.error("[paypal] capture failed", msg);
          return Response.json({ error: msg }, { status: 502 });
        }
      },
    },
  },
});
