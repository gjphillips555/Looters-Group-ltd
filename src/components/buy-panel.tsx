import { useEffect, useMemo, useState } from "react";
import type { Product, ShippingOption } from "@/data/catalog";
import { formatNzd } from "@/lib/utils";

function tradeMeUrl(listingId: string) {
  return `https://www.trademe.co.nz/a/listing/${listingId}`;
}

type PaypalStatus = {
  configured: boolean;
  mode: string;
  webhookIdSet: boolean;
};

export function BuyPanel({ product }: { product: Product }) {
  const options = product.shippingOptions ?? [];
  const [shippingId, setShippingId] = useState<string>(() =>
    options[0] ? String(options[0].id) : "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paypal, setPaypal] = useState<PaypalStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/paypal/status");
        const data = (await res.json()) as {
          paypal?: PaypalStatus;
        };
        if (!cancelled && data.paypal) setPaypal(data.paypal);
      } catch {
        if (!cancelled) setPaypal({ configured: false, mode: "unknown", webhookIdSet: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected: ShippingOption | null = useMemo(() => {
    if (!options.length) return null;
    return options.find((o) => String(o.id) === shippingId) ?? options[0];
  }, [options, shippingId]);

  const shipPrice = selected?.price ?? 0;
  const total = Number((product.price + shipPrice).toFixed(2));
  const lid = product.listingId ?? product.id;
  const paypalReady = paypal?.configured === true;

  async function payWithPayPal() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          listingId: lid,
          shippingId: selected ? selected.id : undefined,
        }),
      });
      const data = (await res.json()) as { approveUrl?: string; error?: string };
      if (!res.ok || !data.approveUrl) {
        const msg = data.error || "Could not start PayPal checkout";
        if (res.status === 503) {
          throw new Error(
            "PayPal is not set up on this site yet. Use Pay via Trade Me, or add PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET on the Vercel project for this app only.",
          );
        }
        throw new Error(msg);
      }
      window.location.href = data.approveUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "PayPal error");
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 rounded-3xl border border-line bg-cream/60 p-5 shadow-border">
      <h2 className="font-display text-lg font-bold">Buy this item</h2>
      <p className="mt-1 text-sm text-muted">
        Same Trade Me listing specs and shipping. Pay here with PayPal, or finish on Trade Me.
        After a PayPal payment clears, we unlist the Trade Me ad.
      </p>

      {options.length > 0 ? (
        <fieldset className="mt-5">
          <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Shipping (from Trade Me)
          </legend>
          <ul className="mt-2 space-y-2">
            {options.map((o) => {
              const id = String(o.id);
              return (
                <li key={id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-line has-[:checked]:ring-2 has-[:checked]:ring-computas-hot">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-1"
                      checked={shippingId === id}
                      onChange={() => setShippingId(id)}
                    />
                    <span className="flex min-w-0 flex-1 justify-between gap-3 text-sm">
                      <span className="text-ink">{o.label}</span>
                      <span className="shrink-0 font-semibold tabular-nums">
                        {o.price <= 0 ? "Free" : formatNzd(o.price)}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Shipping to be arranged with seller (or free pickup). PayPal total uses the item price only
          unless Trade Me lists a shipping option.
        </p>
      )}

      <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-4">
        <span className="text-sm text-muted">Total</span>
        <span className="font-display text-2xl font-bold tabular-nums text-computas-hot">
          {formatNzd(total)}
        </span>
      </div>
      {selected && shipPrice > 0 ? (
        <p className="mt-1 text-right text-xs text-muted">
          Item {formatNzd(product.price)} + shipping {formatNzd(shipPrice)}
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {paypal && !paypalReady ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
          PayPal checkout is not linked on this site yet. Use Trade Me for now, or add PayPal keys
          under Vercel → <strong>looterscomputas</strong> → Environment Variables (this project only).
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={busy || product.price <= 0 || paypal === null || !paypalReady}
          onClick={() => void payWithPayPal()}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#0070ba] px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy
            ? "Redirecting to PayPal…"
            : paypal === null
              ? "Checking PayPal…"
              : paypalReady
                ? "Pay via PayPal"
                : "PayPal not linked"}
        </button>
        <a
          href={tradeMeUrl(lid)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-computas-hot px-5 text-sm font-semibold text-white"
        >
          Pay via Trade Me
        </a>
      </div>

      {paypalReady ? (
        <p className="mt-3 text-center text-[11px] text-muted">
          Secure checkout via PayPal ({paypal.mode}) · returns to this site only
        </p>
      ) : null}
    </div>
  );
}
