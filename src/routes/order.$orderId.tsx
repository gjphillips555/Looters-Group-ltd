import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, Mail } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getOrder, orderMailto, type PlacedOrder } from "@/lib/orders";
import { nzd } from "@/lib/products";

export const Route = createFileRoute("/order/$orderId")({
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<PlacedOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrder(orderId) ?? null);
  }, [orderId]);

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

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <CheckCircle2 className="size-10 text-accent" />
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Order placed
          </h1>
          <p className="text-sm text-muted-foreground">
            Reference <span className="font-medium text-foreground">{order.id}</span>
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Email this order to LootersRetail so we can confirm stock and
            payment, or complete each Buy Now on TradeMe with Ping or Afterpay.
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <a href={orderMailto(order)}>
                <Mail /> Email order to LootersRetail
              </a>
            </Button>
            <Button asChild variant="outline">
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
                      Qty {line.qty} · {nzd(line.amount * line.qty)} ·{" "}
                      {ship?.label ?? "Shipping"}{" "}
                      {ship && ship.price > 0 ? nzd(ship.price) : "Free"}
                    </p>
                    <a
                      href={line.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Pay on TradeMe <ExternalLink className="size-3" />
                    </a>
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
