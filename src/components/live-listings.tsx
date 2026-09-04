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
      <p className="text-sm text-muted">
        Loading live Trade Me listings…
      </p>
    );
  }

  const shown = Array.from({ length: Math.min(count, items.length) }, (_, i) => {
    return items[(offset + i) % items.length];
  });

  return (
    <div
      className={
        visible
          ? "grid gap-4 opacity-100 transition-opacity duration-200 sm:grid-cols-2"
          : "grid gap-4 opacity-0 transition-opacity duration-200 sm:grid-cols-2"
      }
    >
      {shown.map((p) => (
        <ProductCard key={`${offset}-${p.id}`} product={p} />
      ))}
    </div>
  );
}
