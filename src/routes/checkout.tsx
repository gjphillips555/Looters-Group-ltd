import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PayWithPaypal } from "@/components/pay-with-paypal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, useCartTotals } from "@/lib/cart-store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { NZ_REGIONS, nzd } from "@/lib/products";
import { packingLabel } from "@/lib/shipping";
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
  const { lines, subtotal, shippingTotal, total, itemCount, shippingReady, packages } =
    useCartTotals();
  const setShipping = useCart((s) => s.setShipping);
  const { user } = useCurrentUserState();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [error, setError] = useState<string | null>(null);
  const [orderId] = useState(() => newOrderId());

  const gstPortion = total - total / 1.15;

  useEffect(() => {
    if (!user) return;
    setCustomer((prev) => ({
      ...prev,
      name: prev.name || user.displayName || "",
      email: prev.email || user.primaryEmail || "",
    }));
  }, [user]);

  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setCustomer((prev) => ({ ...prev, [key]: value }));
  }

  const detailsOk = useMemo(() => {
    return (
      customer.name.trim().length > 1 &&
      /.+@.+\..+/.test(customer.email) &&
      customer.phone.trim().length >= 7 &&
      customer.address.trim().length > 2 &&
      customer.city.trim().length > 1 &&
      customer.region.trim().length > 1
    );
  }, [customer]);

  const canPay = lines.length > 0 && detailsOk && shippingReady;

  function persistOrder() {
    if (!canPay) {
      setError(
        shippingReady
          ? "Please complete your contact and delivery details."
          : "Select a shipping option on every item to tally PayPal.",
      );
      return false;
    }
    saveOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      customer,
      lines,
      subtotal,
      shippingTotal,
      total,
    });
    return true;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    persistOrder();
  }

  if (lines.length === 0) {
    return (
      <AppShell>
        <div className="py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a product before checking out.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Browse shop</Link>
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
            Choose shipping on each item so we can pack in threes and send you
            to PayPal with the right total.
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
            {lines.map((line) => (
              <li key={line.id} className="flex flex-col gap-2">
                <div className="flex gap-3">
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
                  </div>
                </div>
                {line.shipping.length > 0 && (
                  <select
                    aria-label={`Shipping for ${line.title}`}
                    value={line.shippingId}
                    onChange={(e) => setShipping(line.id, e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <option value="">Select shipping</option>
                    {line.shipping.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} — {s.price > 0 ? nzd(s.price) : "Free"}
                      </option>
                    ))}
                  </select>
                )}
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Items</dt>
              <dd className="tabular-nums">{nzd(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Shipping</dt>
              <dd className="tabular-nums">
                {shippingReady
                  ? shippingTotal > 0
                    ? nzd(shippingTotal)
                    : "Free"
                  : "Select options"}
              </dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>GST (15% incl.)</dt>
              <dd className="tabular-nums">{nzd(gstPortion)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums text-accent">
                {shippingReady ? nzd(total) : nzd(subtotal)}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            {packingLabel(itemCount, packages, shippingReady)}
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <PayWithPaypal
            orderId={orderId}
            amount={shippingReady ? total : 0}
            disabled={!canPay}
            onBeforePay={persistOrder}
          />
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
