import { Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { KeyButton, KeyLink } from "@/components/key-button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useCart, useCartTotals } from "@/lib/cart-store";
import { cartCheckoutSearch } from "@/lib/orders";
import { nzd } from "@/lib/products";
import { packingLabel } from "@/lib/shipping";

const GST_RATE = 0.15;

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setQty, setShipping, remove, clear } = useCart();
  const {
    lines,
    itemCount,
    subtotal,
    shippingTotal,
    shippingReady,
    packages,
    total,
  } = useCartTotals();
  const gstPortion = total - total / (1 + GST_RATE);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/70 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShoppingBag className="size-5 text-primary" />
            Your cart
            <span className="text-sm font-normal text-muted-foreground">
              ({itemCount})
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div className="space-y-2">
                <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Your cart is empty. Add some finds.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-5">
              {lines.map((line) => (
                <li key={line.id} className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-md bg-secondary/40">
                      {line.photo ? (
                        <img
                          src={line.photo}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">
                        {line.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {nzd(line.amount)} each
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <QuantityStepper
                          size="sm"
                          value={line.qty}
                          max={line.maxQty}
                          onChange={(q) => setQty(line.id, q)}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold tabular-nums">
                            {nzd(line.amount * line.qty)}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(line.id)}
                            aria-label={`Remove ${line.title}`}
                            className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {line.shipping.length > 0 && (
                    <div className="rounded-lg border border-border/70 bg-secondary/30 p-2.5">
                      <label
                        htmlFor={`ship-${line.id}`}
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        <Truck className="size-3.5" /> Shipping
                      </label>
                      <select
                        id={`ship-${line.id}`}
                        value={line.shippingId}
                        onChange={(e) => setShipping(line.id, e.target.value)}
                        className="h-10 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
                      >
                        <option value="">Select shipping</option>
                        {line.shipping.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label} — {s.price > 0 ? nzd(s.price) : "Free"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="space-y-4 border-t border-border px-5 py-4">
            <dl className="space-y-1.5 text-sm">
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
              <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums text-accent">
                  {shippingReady ? nzd(total) : nzd(subtotal)}
                </dd>
              </div>
            </dl>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {packingLabel(itemCount, packages, shippingReady)}. Packs of 3
              share the dearest option; every extra 3 items add the next
              dearest.
            </p>
            <div className="flex items-center gap-2">
              <KeyButton
                type="button"
                size="sm"
                tone="orange"
                className="flex-1"
                onClick={clear}
              >
                Clear
              </KeyButton>
              <KeyLink
                to="/checkout"
                search={cartCheckoutSearch}
                onClick={onClose}
                size="sm"
                tone="teal"
                className="flex-1"
              >
                Checkout
              </KeyLink>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
