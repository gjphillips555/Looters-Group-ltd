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

function catNumber(product: Product) {
  const raw = product.categoryNumber || product.categoryPath || "";
  const match = raw.match(/0002(?:-\d+)*/);
  return match ? match[0].replace(/-+$/g, "") : "";
}

function catPath(product: Product) {
  const path = norm(product.categoryPath);
  if (!path.includes("/")) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

const LAPTOP_TITLE =
  /\b(laptop|notebook|macbook|chromebook|elitebook|probook|thinkpad|latitude|zenbook|vivobook|gram|surface laptop|yoga)\b/;
const DESKTOP_TITLE =
  /\b(desktop|optiplex|prodesk|elitedesk|thinkcentre|sff|mini pc|nuc|imac|mac mini|gaming pc|tower pc|workstation)\b/;
const NOT_A_MACHINE =
  /\b(bag|sleeve|backpack|battery|charger|adaptor|adapter|dock|hdd|hard drive|ram|memory|cable|monitor only)\b/;

/** Exclusive bucket from TradeMe number, then path, then title. */
export function productKind(product: Product): Exclude<ShopCategoryId, "all"> {
  const n = catNumber(product);
  const path = catPath(product);
  const title = norm(product.title);

  if (
    /^0002-4715-(6911|4716)/.test(n) ||
    /\/computers\/desktops\/(crt-monitor|lcd-monitor)(\/|$)/.test(path)
  ) {
    return "components";
  }

  if (
    /^0002-0356-0032/.test(n) ||
    /\/computers\/laptops\/laptops(\/|$)/.test(path)
  ) {
    return "laptops";
  }

  if (/^0002-4715/.test(n) || /\/computers\/desktops(\/|$)/.test(path)) {
    return "desktops";
  }

  if (/^0002-0356/.test(n) || /\/computers\/laptops(\/|$)/.test(path)) {
    if (LAPTOP_TITLE.test(title) && !NOT_A_MACHINE.test(title)) return "laptops";
    return "components";
  }

  if (LAPTOP_TITLE.test(title) && !NOT_A_MACHINE.test(title)) return "laptops";
  if (DESKTOP_TITLE.test(title) && !/monitor/.test(title)) return "desktops";

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
