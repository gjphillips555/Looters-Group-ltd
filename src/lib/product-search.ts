import { create } from "zustand";
import type { Product } from "@/lib/products";

export type ShopCategoryId = "desktops" | "laptops" | "components" | "all";

export const SHOP_CATEGORIES: { id: ShopCategoryId; label: string }[] = [
  { id: "desktops", label: "Desktops" },
  { id: "laptops", label: "Laptops" },
  { id: "components", label: "Components" },
  { id: "all", label: "All products" },
];

export function productInCategory(product: Product, category: ShopCategoryId) {
  if (category === "all") return true;
  const hay = `${product.categoryName ?? ""} ${product.categoryPath ?? ""} ${product.title}`.toLowerCase();
  if (category === "desktops") return hay.includes("desktop");
  if (category === "laptops") return /laptop|notebook/.test(hay);
  if (category === "components") return hay.includes("component");
  return true;
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
