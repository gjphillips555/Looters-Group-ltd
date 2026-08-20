import { useState, type FormEvent } from "react";
import type { Product } from "@/data/catalog";
import { APPAREL_SIZES } from "@/data/catalog";
import { requestApparel } from "@/lib/apparel-orders";

export function ApparelOrder({ product }: { product: Product }) {
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await requestApparel({
      data: {
        productId: product.id,
        title: product.title,
        size,
        qty,
        name,
        email,
        note,
      },
    });
    setBusy(false);
    if (res.ok) setDone(true);
  }

  if (done) {
    return (
      <p className="mt-6 rounded-2xl bg-ok/10 px-4 py-3 text-sm text-ok">
        You’re on the list. When this hits Trade Me we’ll know your size.
      </p>
    );
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={(e) => void submit(e)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Coming to Trade Me · free to register interest
      </p>
      <div className="flex flex-wrap gap-2">
        {(product.sizes ?? APPAREL_SIZES).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={
              size === s
                ? "min-h-10 min-w-10 rounded-full bg-apparel px-3 text-sm font-semibold text-cream"
                : "min-h-10 min-w-10 rounded-full bg-cream px-3 text-sm font-medium shadow-border"
            }
          >
            {s}
          </button>
        ))}
      </div>
      <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Qty
        <input
          type="number"
          min={1}
          max={6}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="mt-1 min-h-11 w-24 rounded-xl border border-line bg-cream px-3 text-sm"
        />
      </label>
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm"
      />
      <textarea
        placeholder="Anything else (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={busy}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-apparel text-sm font-semibold text-cream disabled:opacity-50"
      >
        {busy ? "Saving…" : "I’m interested"}
      </button>
      <p className="text-xs text-muted">
        No payment here. Same as Computas — the sale happens on Trade Me when the
        drop is listed.
      </p>
    </form>
  );
}
