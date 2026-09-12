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

/**
 * First letter of the category + a digit that looks like the 2nd letter.
 * Laptops LA→L4, Desktops DE→D3, Components CO→C0.
 * Exact stamp only. Brackets optional: [L4]
 */
export const TITLE_CATEGORY_CODES: {
  id: ShopCategoryPage;
  label: string;
  sample: string;
  match: RegExp;
}[] = [
  { id: "laptops", label: "Laptops", sample: "L4", match: /(?:^|[\s\[\(\/\-])L4(?:$|[\s\]\)\/\-])/i },
  { id: "desktops", label: "Desktops", sample: "D3", match: /(?:^|[\s\[\(\/\-])D3(?:$|[\s\]\)\/\-])/i },
  { id: "components", label: "Components", sample: "C0", match: /(?:^|[\s\[\(\/\-])C0(?:$|[\s\]\)\/\-])/i },
];

export function categoryFromTitleCode(title: string): ShopCategoryPage | null {
  const padded = ` ${title} `;
  let best: { index: number; id: ShopCategoryPage } | null = null;
  for (const code of TITLE_CATEGORY_CODES) {
    const m = padded.match(code.match);
    if (!m || m.index == null) continue;
    if (!best || m.index < best.index) best = { index: m.index, id: code.id };
  }
  return best?.id ?? null;
}

export type PriceSort = "default" | "price-asc" | "price-desc";

export function isShopCategoryPage(value: string): value is ShopCategoryPage {
  return (SHOP_CATEGORY_PAGES as readonly string[]).includes(value);
}

export function shopPath(id: ShopCategoryId) {
  return id === "all" ? "/shop" : `/shop/${id}`;
}

/** Category comes only from L4 / D3 / C0 in the title. No stamp → uncategorised. */
export function productKind(product: Product): ShopCategoryPage | null {
  return categoryFromTitleCode(product.title);
}

export function productInCategory(product: Product, category: ShopCategoryId) {
  if (category === "all") return true;
  return productKind(product) === category;
}

export function categoryBadge(product: Product) {
  const id = productKind(product);
  return SHOP_CATEGORIES.find((c) => c.id === id)?.label ?? "";
}

/** Detector list — used to spot brands in titles. Unknown brands still surface via attributes. */
const BRAND_DETECT = [
  "HP",
  "Hewlett Packard",
  "Dell",
  "Lenovo",
  "ThinkPad",
  "ThinkCentre",
  "ASUS",
  "ROG",
  "Acer",
  "MSI",
  "Apple",
  "MacBook",
  "iMac",
  "Microsoft",
  "Surface",
  "GIGABYTE",
  "Gigabyte",
  "Aorus",
  "Intel",
  "AMD",
  "NVIDIA",
  "GeForce",
  "Radeon",
  "Corsair",
  "Razer",
  "Logitech",
  "SteelSeries",
  "HyperX",
  "Attack Shark",
  "NZXT",
  "Cooler Master",
  "Thermaltake",
  "G.SKILL",
  "G.Skill",
  "Kingston",
  "Samsung",
  "Seagate",
  "Western Digital",
  "WD ",
  "Toshiba",
  "Fujitsu",
  "Panasonic",
  "Sony",
  "LG",
  "BenQ",
  "ViewSonic",
  "Philips",
  "Alienware",
  "Framework",
  "Raspberry Pi",
  "Elgato",
  "EVGA",
  "ASRock",
  "Sapphire",
  "PowerColor",
  "Zotac",
  "Palit",
  "PNY",
  "Crucial",
  "SanDisk",
  "Patriot",
  "TeamGroup",
  "be quiet!",
  "Fractal",
  "Lian Li",
  "Phanteks",
  "Deepcool",
  "Noctua",
  "Arctic",
  "TP-Link",
  "Netgear",
  "Ubiquiti",
  "Cisco",
  "Synology",
  "QNAP",
  "Wacom",
  "Huawei",
  "Honor",
  "Xiaomi",
  "MSI",
  "Compaq",
  "IBM",
  "Gateway",
  "eMachines",
  "Clevo",
  "Tongfang",
  "Razer",
  "Corsair",
];

const BRAND_ALIAS: Record<string, string> = {
  "hewlett packard": "HP",
  thinkpad: "Lenovo",
  thinkcentre: "Lenovo",
  thinkbook: "Lenovo",
  macbook: "Apple",
  imac: "Apple",
  "mac mini": "Apple",
  "mac studio": "Apple",
  "mac pro": "Apple",
  surface: "Microsoft",
  aorus: "GIGABYTE",
  gigabyte: "GIGABYTE",
  rog: "ASUS",
  geforce: "NVIDIA",
  radeon: "AMD",
  "wd ": "Western Digital",
  "western digital": "Western Digital",
  "g.skill": "G.SKILL",
  "attack shark": "Attack Shark",
  "cooler master": "Cooler Master",
  "raspberry pi": "Raspberry Pi",
  "tp-link": "TP-Link",
  "be quiet!": "be quiet!",
  "lian li": "Lian Li",
};

function canonicalBrand(raw: string) {
  const key = raw.toLowerCase().trim();
  if (BRAND_ALIAS[key]) return BRAND_ALIAS[key];
  const hit = BRAND_DETECT.find((b) => b.toLowerCase() === key);
  return hit ?? raw.trim().replace(/\s+/g, " ");
}

export function productBrand(product: Product): string | null {
  const attr = product.attributes.find((a) =>
    /^(brand|manufacturer|make|series)$/i.test(a.name),
  );
  if (attr?.value.trim()) return canonicalBrand(attr.value);

  const title = product.title;
  const lower = title.toLowerCase();
  let found: { name: string; index: number } | null = null;
  for (const brand of BRAND_DETECT) {
    const i = lower.indexOf(brand.toLowerCase());
    if (i < 0) continue;
    const before = i === 0 || !/[a-z0-9]/i.test(title[i - 1] ?? "");
    const after = !/[a-z]/i.test(title[i + brand.length] ?? "");
    if (!before || !after) continue;
    if (!found || i < found.index) found = { name: canonicalBrand(brand), index: i };
  }
  return found?.name ?? null;
}

export function brandsFromProducts(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const b = productBrand(p);
    if (b) set.add(b);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function productMatchesBrand(product: Product, brand: string) {
  if (!brand || brand === "all") return true;
  const got = productBrand(product);
  if (got && got.toLowerCase() === brand.toLowerCase()) return true;
  return product.title.toLowerCase().includes(brand.toLowerCase());
}

export const useProductSearch = create<{
  query: string;
  category: ShopCategoryId;
  sort: PriceSort;
  brand: string;
  setQuery: (query: string) => void;
  setCategory: (category: ShopCategoryId) => void;
  setSort: (sort: PriceSort) => void;
  setBrand: (brand: string) => void;
}>((set) => ({
  query: "",
  category: "all",
  sort: "default",
  brand: "all",
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category, brand: "all" }),
  setSort: (sort) => set({ sort }),
  setBrand: (brand) => set({ brand }),
}));
