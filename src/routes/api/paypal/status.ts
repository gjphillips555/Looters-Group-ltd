import { createFileRoute } from "@tanstack/react-router";
import { paypalConfigured, paypalMode, paypalWebhookId } from "@/lib/paypal";

export const Route = createFileRoute("/api/paypal/status")({
  server: {
    handlers: {
      GET: () => {
        const trademe =
          Boolean(process.env.TRADEME_CONSUMER_KEY?.trim()) &&
          Boolean(process.env.TRADEME_CONSUMER_SECRET?.trim());

        return Response.json({
          paypal: {
            configured: paypalConfigured(),
            mode: paypalMode(),
            webhookIdSet: Boolean(paypalWebhookId()),
          },
          trademe: {
            configured: trademe,
            memberId: process.env.TRADEME_MEMBER_ID?.trim() || "9233545",
          },
          checkout: {
            createOrder: "/api/paypal/create-order",
            captureOrder: "/api/paypal/capture-order",
            webhook: "/api/paypal/webhook",
            successPage: "/checkout/success",
          },
          ready: paypalConfigured() && trademe && Boolean(paypalWebhookId()),
        });
      },
    },
  },
});
