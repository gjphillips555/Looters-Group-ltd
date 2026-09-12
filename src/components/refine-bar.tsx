import { brandsFromProducts, useProductSearch, type PriceSort } from "@/lib/product-search";
import type { Product } from "@/lib/products";

export function RefineBar({ products }: { products: Product[] }) {
  const sort = useProductSearch((s) => s.sort);
  const brand = useProductSearch((s) => s.brand);
  const setSort = useProductSearch((s) => s.setSort);
  const setBrand = useProductSearch((s) => s.setBrand);
  const brands = brandsFromProducts(products);

  return (
    <div className="refine-bar">
      <label className="refine-field">
        <span>Sort</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as PriceSort)}
          aria-label="Sort products"
        >
          <option value="default">Featured</option>
          <option value="price-asc">Lowest price</option>
          <option value="price-desc">Highest price</option>
        </select>
      </label>
      <label className="refine-field">
        <span>Brand</span>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Filter by brand"
        >
          <option value="all">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
