import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, useCartTotals } from "@/lib/cart-store";
import {
  islandForRegion,
  NZ_REGIONS,
  nzd,
} from "@/lib/products";
import { newOrderId, saveOrder, type Customer } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const emptyCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  suburb: "",
  city: "",
  region: "Wellington",
  notes: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, shippingTotal, total, itemCount } = useCartTotals();
  const applyIsland = useCart((s) => s.applyIsland);
  const clear = useCart((s) => s.clear);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gstPortion = total - total / 1.15;

  useEffect(() => {
    applyIsland(islandForRegion(customer.region));
  }, [applyIsland, customer.region]);

  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "region") {
        applyIsland(islandForRegion(String(value)));
      }
      return next;
    });
  }

  const canSubmit = useMemo(() => {
    return (
      lines.length > 0 &&
      customer.name.trim().length > 1 &&
      /.+@.+\..+/.test(customer.email) &&
      customer.phone.trim().length >= 7 &&
      customer.address.trim().length > 2 &&
      customer.city.trim().length > 1 &&
      customer.region.trim().length > 1
    );
  }, [lines.length, customer]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please complete your contact and delivery details.");
      return;
    }
    setSubmitting(true);
    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      customer,
      lines,
      subtotal,
      shippingTotal,
      total,
    };
    saveOrder(order);
    clear();
    void navigate({
      to: "/order/$orderId",
      params: { orderId: order.id },
    });
  }

  if (lines.length === 0) {
    return (
      <AppShell>
        <div className="py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a Buy Now listing before checking out.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Browse listings</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight">
        Checkout
      </h1>
      <form
        onSubmit={onSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <section className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Your details</h2>
          <Field label="Full name" htmlFor="name">
            <Input
              id="name"
              autoComplete="name"
              required
              value={customer.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={customer.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                required
                value={customer.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Street address" htmlFor="address">
            <Input
              id="address"
              autoComplete="street-address"
              required
              value={customer.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Suburb" htmlFor="suburb">
              <Input
                id="suburb"
                autoComplete="address-level3"
                value={customer.suburb}
                onChange={(e) => update("suburb", e.target.value)}
              />
            </Field>
            <Field label="City" htmlFor="city">
              <Input
                id="city"
                autoComplete="address-level2"
                required
                value={customer.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </Field>
            <Field label="Region" htmlFor="region">
              <select
                id="region"
                value={customer.region}
                onChange={(e) => update("region", e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {NZ_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Order notes (optional)" htmlFor="notes">
            <textarea
              id="notes"
              rows={3}
              value={customer.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              placeholder="Pickup window, courier instructions…"
            />
          </Field>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Shipping is matched to your island from the TradeMe listing. After
            you place the order you can email it to us, or pay each item on
            TradeMe with Ping or Afterpay.
          </p>
        </section>

        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">
            Order summary
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({itemCount})
            </span>
          </h2>
          <ul className="space-y-3">
            {lines.map((line) => {
              const ship = line.shipping.find((s) => s.id === line.shippingId);
              return (
                <li key={line.id} className="flex gap-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-md bg-secondary/40">
                    {line.photo ? (
                      <img src={line.photo} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{line.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {line.qty} · {nzd(line.amount * line.qty)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ship?.label ?? "Shipping TBC"} ·{" "}
                      {ship && ship.price > 0 ? nzd(ship.price) : "Free"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <dl className="space-y-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Items</dt>
              <dd className="tabular-nums">{nzd(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {shippingTotal > 0 ? nzd(shippingTotal) : "Free"}
              </dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>GST (15% incl.)</dt>
              <dd className="tabular-nums">{nzd(gstPortion)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums text-accent">{nzd(total)}</dd>
            </div>
          </dl>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={!canSubmit || submitting}>
            Place order · {nzd(total)}
          </Button>
        </aside>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
