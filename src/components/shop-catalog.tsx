import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { BrandTicker } from "@/components/brand-ticker";
import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-grid";
import { RefineBar } from "@/components/refine-bar";
import { ShopSearch } from "@/components/shop-search";
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
      <CategoryNav />
      <div className="mb-3 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-xl font-semibold">{label}</h1>
        <ShopSearch className="w-full sm:max-w-md" variant="plain" />
      </div>
      <RefineBar products={products} />
      <ProductGrid
        key={category}
        products={products}
        error={catalog.error}
        category={category}
        layout="grid"
      />
    </AppShell>
  );
}
