import { useEffect, useState } from "react";
import { useStoreListings } from "@/lib/listings";
import { ProductCard } from "@/components/product-card";

const INTERVAL_MS = 5000;

export function LiveListings({ count = 2 }: { count?: number }) {
  const items = useStoreListings("computas", []);
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length <= count) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduced ? 12000 : INTERVAL_MS;
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setOffset((n) => (n + count) % items.length);
        setVisible(true);
      }, reduced ? 0 : 220);
    }, ms);
    return () => window.clearInterval(id);
  }, [count, items.length]);

  if (items.length === 0) {
    return (
      <div
        className="grid min-h-[14rem] gap-4 sm:grid-cols-2"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-cream shadow-border"
          >
            <div className="aspect-[4/3] animate-pulse bg-line/60" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-line" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
              <div className="h-4 w-20 animate-pulse rounded bg-line" />
            </div>
          </div>
        ))}
        <p className="sr-only">Loading live Trade Me listings…</p>
      </div>
    );
  }

  const shown = Array.from({ length: Math.min(count, items.length) }, (_, i) => {
    return items[(offset + i) % items.length];
  });

  return (
    <div
      className={
        visible
          ? "grid min-h-[14rem] gap-4 opacity-100 transition-opacity duration-200 sm:grid-cols-2"
          : "grid min-h-[14rem] gap-4 opacity-0 transition-opacity duration-200 sm:grid-cols-2"
      }
    >
      {shown.map((p) => (
        <ProductCard key={`${offset}-${p.id}`} product={p} />
      ))}
    </div>
  );
}
