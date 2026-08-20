import { createFileRoute, Link } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { cartTotal, useCart } from "@/lib/cart";
import { formatNzd } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { lines, setQty, remove, clear } = useCart();
  const total = cartTotal(lines);

  return (
    <BranchShell>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-extrabold">Bag</h1>
        <p className="mt-2 text-sm text-muted">
          Computas hardware is fulfilled via the matching Trade Me listing so stock
          cannot sell twice. Apparel is store / pickup.
        </p>
        {lines.length === 0 ? (
          <p className="mt-10 text-muted">Your bag is empty.</p>
        ) : (
          <ul className="mt-8 divide-y divide-line">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-4 py-4">
                <img src={l.image} alt="" className="media size-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{l.title}</p>
                  <p className="mt-1 text-sm tabular-nums text-computas-hot">
                    {formatNzd(l.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="text-xs text-muted">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={l.qty}
                        onChange={(e) => setQty(l.id, Number(e.target.value))}
                        className="ml-2 w-16 rounded-lg border border-line bg-cream px-2 py-1"
                      />
                    </label>
                    <button
                      type="button"
                      className="text-xs text-muted underline"
                      onClick={() => remove(l.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {lines.length > 0 ? (
          <div className="mt-8 flex items-center justify-between">
            <p className="font-display text-2xl font-bold tabular-nums">{formatNzd(total)}</p>
            <div className="flex gap-2">
              <button type="button" onClick={clear} className="min-h-11 px-3 text-sm text-muted">
                Clear
              </button>
              <Link
                to="/computas/policy"
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-cream"
              >
                Checkout notes
              </Link>
            </div>
          </div>
        ) : null}
      </main>
    </BranchShell>
  );
}
