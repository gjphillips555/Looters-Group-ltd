import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PayWithPaypal } from "@/components/pay-with-paypal";
import { Button } from "@/components/ui/button";
import { getOrder, type PlacedOrder } from "@/lib/orders";
import { nzd } from "@/lib/products";
import { packingLabel } from "@/lib/shipping";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/order/$orderId")({
  validateSearch: (search: Record<string, unknown>) => ({
    paid: search.paid === "1" || search.paid === 1,
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const { paid } = Route.useSearch();
  const clear = useCart((s) => s.clear);
  const [order, setOrder] = useState<PlacedOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrder(orderId) ?? null);
  }, [orderId]);

  useEffect(() => {
    if (paid) clear();
  }, [paid, clear]);

  if (order === undefined) {
    return (
      <AppShell>
        <p className="py-24 text-center text-sm text-muted-foreground">
          Loading order…
        </p>
      </AppShell>
    );
  }

  if (!order) {
    return (
      <AppShell>
        <div className="py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This confirmation is stored on this device only.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Back to shop</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const packing = packingLabel(
    order.lines.reduce((n, l) => n + l.qty, 0),
    Math.ceil(order.lines.reduce((n, l) => n + l.qty, 0) / 3),
    true,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <CheckCircle2 className="size-10 text-accent" />
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {paid ? "Payment sent" : "Order saved"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Reference <span className="font-medium text-foreground">{order.id}</span>
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {paid
              ? "PayPal will email a receipt. We'll pack once the payment lands."
              : "Finish with PayPal so we can confirm the total and pack your order."}
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            {!paid && (
              <PayWithPaypal orderId={order.id} amount={order.total} />
            )}
            <Button asChild variant={paid ? "default" : "outline"} className="flex-1">
              <Link to="/">Keep shopping</Link>
            </Button>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Items</h2>
          <ul className="space-y-4">
            {order.lines.map((line) => {
              const ship = line.shipping.find((s) => s.id === line.shippingId);
              return (
                <li key={line.id} className="flex gap-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-md bg-secondary/40">
                    {line.photo ? (
                      <img src={line.photo} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{line.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {line.qty} · {nzd(line.amount * line.qty)}
                      {ship ? ` · ${ship.label}` : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Items</dt>
              <dd className="tabular-nums">{nzd(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {order.shippingTotal > 0 ? nzd(order.shippingTotal) : "Free"}
              </dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums text-accent">{nzd(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{packing}</p>
          <div className="mt-5 rounded-lg bg-secondary/40 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Deliver to</p>
            <p>
              {order.customer.name}
              <br />
              {order.customer.address}
              <br />
              {[order.customer.suburb, order.customer.city, order.customer.region]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="mt-2">
              {order.customer.email} · {order.customer.phone}
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
