import { createFileRoute } from "@tanstack/react-router";
import { createPayPalOrder, paypalConfigured } from "@/lib/paypal";
import { getListing } from "@/lib/listings";

type Body = {
  listingId?: string;
  shippingId?: string | number;
};

export const Route = createFileRoute("/api/paypal/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!paypalConfigured()) {
          return Response.json(
            {
              error:
                "PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET on Vercel.",
            },
            { status: 503 },
          );
        }

        let body: Body = {};
        try {
          body = (await request.json()) as Body;
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const listingId = String(body.listingId ?? "").trim();
        if (!listingId) {
          return Response.json({ error: "listingId required" }, { status: 400 });
        }

        const product = await getListing({ data: listingId });
        if (!product || product.price <= 0) {
          return Response.json({ error: "Listing not found or not for sale" }, { status: 404 });
        }

        const options = product.shippingOptions ?? [];
        let shippingPrice = 0;
        let shippingLabel = "Pickup / to be arranged";

        if (options.length > 0) {
          const want = body.shippingId != null ? String(body.shippingId) : "";
          const chosen =
            options.find((o) => String(o.id) === want) ??
            options.find((o) => o.type === "free") ??
            options[0];
          if (!chosen) {
            return Response.json({ error: "Invalid shipping option" }, { status: 400 });
          }
          shippingPrice = chosen.price;
          shippingLabel = chosen.label;
        }

        const origin = new URL(request.url).origin;
        const returnUrl = `${origin}/checkout/success?listingId=${encodeURIComponent(listingId)}`;
        const cancelUrl = `${origin}/computas/shop/${encodeURIComponent(listingId)}?paypal=cancel`;

        try {
          const order = await createPayPalOrder({
            listingId: product.listingId ?? product.id,
            title: product.title,
            itemPrice: product.price,
            shippingPrice,
            shippingLabel,
            returnUrl,
            cancelUrl,
          });

          console.info(
            "[paypal] create-order",
            JSON.stringify({
              listingId,
              orderId: order.id,
              item: product.price,
              shipping: shippingPrice,
              label: shippingLabel,
            }),
          );

          return Response.json({
            orderId: order.id,
            approveUrl: order.approveUrl,
            itemPrice: product.price,
            shippingPrice,
            shippingLabel,
            total: Number((product.price + shippingPrice).toFixed(2)),
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "PayPal error";
          console.error("[paypal] create-order failed", msg);
          return Response.json({ error: msg }, { status: 502 });
        }
      },
    },
  },
});
