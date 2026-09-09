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
  return (value ?? "")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function catNumber(product: Product) {
  const raw = `${product.categoryNumber ?? ""} ${product.categoryPath ?? ""}`;
  const match = raw.match(/0002(?:-\d+)*/);
  return match ? match[0].replace(/-+$/g, "") : "";
}

function catPath(product: Product) {
  const path = norm(product.categoryPath).replace(/\s*\/\s*/g, "/");
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

const LAPTOP_TITLE =
  /\b(laptop|notebook|macbook|chromebook|elitebook|probook|thinkpad|latitude|zenbook|vivobook|gram|surface laptop|yoga|pavilion laptop|envy laptop|inspiron 15|inspiron 14|inspiron 13)\b/;
const DESKTOP_TITLE =
  /\b(desktop|optiplex|prodesk|elitedesk|thinkcentre|sff|mini-?pc|nuc|imac|mac mini|gaming pc|tower|workstation|precision tower|compaq|hp 290|hp 800|lenovo m[0-9]{2})\b/;
const COMPONENTISH =
  /\b(monitor|lcd|led display|graphics|gpu|geforce|radeon|video card|ram\b|memory stick|ssd|nvme|hdd|hard drive|power supply|psu|motherboard|mainboard|cable|adapter|adaptor|dock|dongle|bag|sleeve|backpack|battery|charger|keyboard|mouse|webcam|headset|cooling|fan\b|heatsink)\b/;

/**
 * One exclusive bucket per product: laptop | desktop | components.
 * Priority: TradeMe path/number → title keywords → components fallback.
 * A product never belongs to two shop categories at once.
 */
export function productKind(product: Product): Exclude<ShopCategoryId, "all"> {
  const n = catNumber(product);
  const path = catPath(product);
  const name = norm(product.categoryName);
  const title = norm(product.title);
  const blob = `${path} ${name}`;

  // Monitors & parts under Computers → components (not desktops)
  if (
    /^0002-4715-(6911|4716)/.test(n) ||
    /\/computers\/desktops\/(crt-monitor|lcd-monitor)/.test(path) ||
    /\b(crt|lcd)\s*monitor\b/.test(name)
  ) {
    return "components";
  }

  // Explicit laptop categories
  if (
    /^0002-0356-0032/.test(n) ||
    /\/computers\/laptops\/laptops(\/|$)/.test(path) ||
    /\blaptops?\b/.test(name) && !COMPONENTISH.test(title)
  ) {
    return "laptops";
  }

  // Explicit desktop categories (after monitor carve-out)
  if (
    /^0002-4715/.test(n) ||
    /\/computers\/desktops(\/|$)/.test(path) ||
    (/\bdesktops?\b/.test(name) && !COMPONENTISH.test(title))
  ) {
    return "desktops";
  }

  // Broader laptop branch (accessories → components)
  if (/^0002-0356/.test(n) || /\/computers\/laptops(\/|$)/.test(path)) {
    if (LAPTOP_TITLE.test(title) && !COMPONENTISH.test(title)) return "laptops";
    return "components";
  }

  // Title heuristics (mutually exclusive)
  if (LAPTOP_TITLE.test(title) && !COMPONENTISH.test(title)) return "laptops";
  if (DESKTOP_TITLE.test(title) && !COMPONENTISH.test(title)) return "desktops";
  if (COMPONENTISH.test(title) || COMPONENTISH.test(blob)) return "components";

  // Anything else under Computers is treated as a part/peripheral
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
