import { create } from "zustand";
import type { Product } from "@/lib/products";

export type ShopCategoryId = "desktops" | "laptops" | "components" | "all";

export const SHOP_CATEGORIES: { id: ShopCategoryId; label: string }[] = [
  { id: "desktops", label: "Desktops" },
  { id: "laptops", label: "Laptops" },
  { id: "components", label: "Components" },
  { id: "all", label: "All products" },
];

export const SHOP_CATEGORY_PAGES = ["desktops", "laptops", "components"] as const;
export type ShopCategoryPage = (typeof SHOP_CATEGORY_PAGES)[number];

export function isShopCategoryPage(value: string): value is ShopCategoryPage {
  return (SHOP_CATEGORY_PAGES as readonly string[]).includes(value);
}

export function shopPath(id: ShopCategoryId) {
  return id === "all" ? "/shop" : `/shop/${id}`;
}

function norm(value: string | null | undefined) {
  return (value ?? "").toLowerCase().replace(/_/g, "-");
}

/** Exclusive bucket from TradeMe path first, then name/title. */
export function productKind(product: Product): Exclude<ShopCategoryId, "all"> {
  const path = norm(product.categoryPath);
  const name = norm(product.categoryName);
  const title = norm(product.title);

  if (
    /\/laptops?(\/|$)/.test(path) ||
    /(^|\s)laptops?(\s|$)/.test(name) ||
    /\b(laptop|notebook|macbook)\b/.test(title)
  ) {
    return "laptops";
  }

  if (
    /\/desktops?(\/|$)/.test(path) ||
    /(^|\s)desktops?(\s|$)/.test(name) ||
    /\b(desktop|optiplex|prodesk|elitedesk|sff|tower pc|gaming pc)\b/.test(title)
  ) {
    return "desktops";
  }

  return "components";
}

export function productInCategory(product: Product, category: ShopCategoryId) {
  if (category === "all") return true;
  return productKind(product) === category;
}

export const useProductSearch = create<{
  query: string;
  category: ShopCategoryId;
  setQuery: (query: string) => void;
  setCategory: (category: ShopCategoryId) => void;
}>((set) => ({
  query: "",
  category: "all",
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
}));
