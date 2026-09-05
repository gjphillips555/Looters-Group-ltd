import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { SKU_LABELS, skuFor, type SkuCode } from "@/data/catalog";
import { useStoreListings } from "@/lib/listings";

export const Route = createFileRoute("/computas/shop/")({ component: Shop });

const COMPUTAS_SKUS = SKU_LABELS.filter((s) => s.branch === "computas");

function Shop() {
  const [q, setQ] = useState("");
  const [sku, setSku] = useState<SkuCode | "All">("All");
  const catalog = useStoreListings("computas", []);
  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return catalog.filter((p) => {
      if (skuFor(p) === "APARL") return false;
      if (sku !== "All" && skuFor(p) !== sku) return false;
      if (!needle) return true;
      const hay = `${p.title} ${p.blurb} ${p.category} ${skuFor(p)}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [q, sku, catalog]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Shop</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Live Trade Me stock. Pay with PayPal here or on Trade Me.
      </p>
      <div className="mt-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search laptops, CPUs, drives…"
          className="min-h-12 w-full rounded-full border border-line bg-cream px-5 text-sm sm:max-w-md"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSku("All")}
          className={
            sku === "All"
              ? "min-h-10 rounded-full bg-computas px-4 text-sm font-semibold text-cream"
              : "min-h-10 rounded-full bg-cream px-4 text-sm font-medium shadow-border"
          }
        >
          All
        </button>
        {COMPUTAS_SKUS.map((row) => (
          <button
            key={row.code}
            type="button"
            onClick={() => setSku(row.code)}
            className={
              sku === row.code
                ? "min-h-10 rounded-full bg-computas px-4 text-sm font-semibold text-cream"
                : "min-h-10 rounded-full bg-cream px-4 text-sm font-medium shadow-border"
            }
          >
            {row.name}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {catalog.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Loading listings…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No matches.</p>
      ) : null}
    </main>
  );
}
