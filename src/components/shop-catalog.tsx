import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { BrandTicker } from "@/components/brand-ticker";
import { ProductGrid } from "@/components/product-grid";
import {
  productInCategory,
  SHOP_CATEGORIES,
  useProductSearch,
  type ShopCategoryId,
} from "@/lib/product-search";
import type { Catalog } from "@/lib/products";

export function ShopCatalog({
  catalog,
  category,
}: {
  catalog: Catalog;
  category: ShopCategoryId;
}) {
  const setCategory = useProductSearch((s) => s.setCategory);

  // Keep search-store category aligned with the URL so filters don't fight the route.
  useEffect(() => {
    setCategory(category);
  }, [category, setCategory]);

  const label =
    SHOP_CATEGORIES.find((c) => c.id === category)?.label ?? "All products";
  const products = catalog.products.filter((p) =>
    productInCategory(p, category),
  );

  return (
    <AppShell>
      <BrandTicker />
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="font-display text-xl font-semibold">{label}</h1>
        <p className="text-sm text-muted-foreground">Afterpay Available Now!</p>
      </div>
      <ProductGrid
        products={products}
        error={catalog.error}
        category={category}
        layout="grid"
      />
    </AppShell>
  );
}
