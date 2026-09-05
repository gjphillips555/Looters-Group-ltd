import { useEffect, useState } from "react";

const PAIRS = [
  { id: "BTC-NZD", label: "BTC" },
  { id: "ETH-NZD", label: "ETH" },
  { id: "SOL-NZD", label: "SOL" },
  { id: "XRP-NZD", label: "XRP" },
  { id: "ADA-NZD", label: "ADA" },
  { id: "DOGE-NZD", label: "DOGE" },
  { id: "LTC-NZD", label: "LTC" },
  { id: "LINK-NZD", label: "LINK" },
  { id: "AVAX-NZD", label: "AVAX" },
] as const;

type Quote = { label: string; nzd: number };

function formatCoin(n: number) {
  if (n >= 1000) {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      maximumFractionDigits: 0,
    }).format(n);
  }
  if (n >= 10) {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  }
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(n);
}

async function loadQuotes(): Promise<Quote[]> {
  const rows = await Promise.all(
    PAIRS.map(async (p) => {
      const res = await fetch(`https://api.coinbase.com/v2/prices/${p.id}/spot`);
      if (!res.ok) throw new Error("quote failed");
      const json = (await res.json()) as { data?: { amount?: string } };
      const nzd = Number(json.data?.amount);
      if (!Number.isFinite(nzd)) throw new Error("bad quote");
      return { label: p.label, nzd };
    }),
  );
  return rows;
}

function scheduleIdle(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(() => cb(), { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 400);
  return () => window.clearTimeout(id);
}

export function CryptoTicker() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null);

  useEffect(() => {
    let alive = true;
    let intervalId = 0;

    const run = () => {
      loadQuotes()
        .then((rows) => {
          if (alive) setQuotes(rows);
        })
        .catch(() => {
          /* keep last good set */
        });
    };

    // Defer network + state updates until the browser is idle so first input stays snappy
    const cancelIdle = scheduleIdle(() => {
      if (!alive) return;
      run();
      intervalId = window.setInterval(run, 60_000);
    });

    return () => {
      alive = false;
      cancelIdle();
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  const items = quotes ?? PAIRS.map((p) => ({ label: p.label, nzd: NaN }));
  const loop = [...items, ...items];

  return (
    <div className="ticker-slot relative overflow-hidden border-t border-ink/10 bg-ink text-cream">
      <p className="sr-only">Live cryptocurrency prices in New Zealand dollars</p>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent" />
      <div className="ticker-track flex w-max items-center gap-8 py-2 pr-8 text-xs font-medium tracking-wide">
        {loop.map((q, i) => (
          <span key={q.label + i} className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-cream/55">{q.label}/NZD</span>
            <span className="tabular-nums">
              {Number.isFinite(q.nzd) ? formatCoin(q.nzd) : "—"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
