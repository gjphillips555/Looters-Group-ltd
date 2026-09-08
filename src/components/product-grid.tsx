import { useMemo, useState, type ReactNode } from "react";
import { AlertCircle, Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { useProductSearch } from "@/lib/product-search";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  error,
}: {
  products: Product[];
  error?: string;
}) {
  const query = useProductSearch((s) => s.query);
  const setQuery = useProductSearch((s) => s.setQuery);
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.categoryName) set.add(p.categoryName);
    }
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.categoryName !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.categoryName ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [products, query, category]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 py-24 text-center text-muted-foreground">
        <AlertCircle className="size-8 text-destructive" />
        <p className="font-medium text-foreground">Couldn't load products</p>
        <p className="text-sm">
          The catalog is temporarily unavailable. Please try again shortly.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        No products right now — check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 md:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </FilterChip>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No products match that search.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
