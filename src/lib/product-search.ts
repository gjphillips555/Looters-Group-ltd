import { create } from "zustand";
import type { Product } from "@/lib/products";

export type ShopCategoryId = "desktops" | "laptops" | "components" | "all";
export type PriceSort = "default" | "price-asc" | "price-desc";

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

function haystack(product: Product) {
  return norm(
    [
      product.title,
      product.categoryName,
      product.categoryPath,
      product.description,
      ...product.attributes.map((a) => `${a.name} ${a.value}`),
    ].join(" "),
  );
}

/** Portable computer (the machine), not a laptop bag/charger. */
const LAPTOP_MACHINE =
  /\b(laptop|notebook|macbook|chromebook|ultrabook|elitebook|probook|zbook|thinkpad|thinkbook|latitude|xps\s?(13|14|15|16)|zenbook|vivobook|expertbook|tuf dash|tuf gaming a\d|rog zephyrus|rog flow|rog strix scar|swift \d|aspire \d|gram\b|surface (laptop|pro|go|book)|pavilion (13|14|15|16|17|x360)|envy (13|14|15|16|17)|inspiron (13|14|15|16|17)|vostro (13|14|15|16)|spectre|elite dragonfly|2[- ]in[- ]1|convertible)\b/;

const DESKTOP_MACHINE =
  /\b(desktop|optiplex|prodesk|elitedesk|thinkcentre|thinkstation|precision tower|sff\b|usff\b|minitower|microtower|mini-?pc|\bnuc\b|mac mini|mac studio|\bimac\b|mac pro|gaming pc|gaming desktop|gaming tower|\btower\b|workstation|compaq|hp 290|hp 280|hp 400 g|hp 600 g|hp 800 g|lenovo m[0-9]{2}|surface studio)\b/;

const LAPTOP_PART =
  /\b((laptop|notebook)s?\s+(bag|sleeve|backpack|case|charger|adapter|adaptor|battery|ram|memory|ssd|hdd|stand|cooler|cooling pad|keyboard|screen)|((bag|sleeve|backpack|case|charger|adapter|adaptor|cooling pad)\b.{0,24}\b(laptop|notebook)))\b/;

const PART_ONLY =
  /\b(monitor|lcd display|led display|graphics card|video card|\bgpu\b|geforce (gtx|rtx)|radeon rx|rtx \d{3,4}|gtx \d{3,4}|\bsodimm\b|\bdimm\b|memory stick|\bssd\b|\bnvme\b|\bhdd\b|hard drive|ddr[345]\b|\d+\s?gb\s+ram|power supply|\bpsu\b|motherboard|mainboard|heatsink|cpu cooler|wifi card|network card|capture card)\b/;

const ACCESSORY =
  /\b(bag|sleeve|backpack|dongle|dock(ing)? station|hdmi cable|displayport|usb[- ]c hub|cooling pad)\b/;

const CPU = /\b((intel\s+)?core\s?i[3579]|(intel\s+)?i[3579](?:-\d{3,})?|ryzen\s?[3579]|celeron|pentium|xeon|apple (m[1-4]|silicon))\b/;
const OS = /\b(windows\s?(7|8|10|11)|win\s?(10|11)|chrome ?os)\b/;

/**
 * One exclusive bucket per product.
 * Whole machines beat spec words like SSD/RAM/GPU in the title.
 */
export function productKind(product: Product): Exclude<ShopCategoryId, "all"> {
  const n = catNumber(product);
  const path = catPath(product);
  const title = norm(product.title);
  const name = norm(product.categoryName);
  const text = haystack(product);

  const laptopMachine = LAPTOP_MACHINE.test(title);
  const desktopMachine = DESKTOP_MACHINE.test(title);
  const laptopPart = LAPTOP_PART.test(title);
  const wholePc =
    (OS.test(title) && CPU.test(title)) ||
    (/\bgaming\b/.test(title) && CPU.test(title) && !laptopMachine);

  const tmMonitor =
    /^0002-4715-(6911|4716)/.test(n) ||
    /\/computers\/desktops\/(crt-monitor|lcd-monitor)/.test(path) ||
    /\b(crt|lcd)\s*monitor\b/.test(name) ||
    /\b\d{2}["”]?\s*(monitor|display)\b/.test(title);

  const tmLaptopLeaf =
    /^0002-0356-0032/.test(n) || /\/computers\/laptops\/laptops(\/|$)/.test(path);
  const tmLaptopTree = /^0002-0356/.test(n) || /\/computers\/laptops(\/|$)/.test(path);
  const tmDesktopTree =
    /^0002-4715/.test(n) || /\/computers\/desktops(\/|$)/.test(path);
  const tmPartsTree =
    /^0002-0359/.test(n) ||
    /\/computers\/(components|parts|internal-storage|memory|graphics)/.test(path);

  if (tmMonitor || laptopPart) return "components";
  if (laptopMachine && !laptopPart) return "laptops";
  if (desktopMachine && !laptopMachine) return "desktops";
  if (wholePc && !laptopMachine && !PART_ONLY.test(title.split("|")[0] ?? title)) {
    return "desktops";
  }

  if (PART_ONLY.test(title) && !laptopMachine && !desktopMachine && !wholePc) {
    return "components";
  }
  if (ACCESSORY.test(title) && !laptopMachine && !desktopMachine && !wholePc) {
    return "components";
  }

  if (tmLaptopLeaf || (tmLaptopTree && laptopMachine)) return "laptops";
  if (tmLaptopTree && !laptopMachine) return "components";
  if (tmDesktopTree && !tmMonitor && !laptopMachine) return "desktops";
  if (tmPartsTree) return "components";

  if (/\blaptops?\b/.test(name) && !PART_ONLY.test(title) && !laptopPart) {
    return "laptops";
  }
  if (/\bdesktops?\b/.test(name) && !tmMonitor && !laptopMachine) return "desktops";
  if (PART_ONLY.test(text) && !laptopMachine && !desktopMachine && !wholePc) {
    return "components";
  }

  return "components";
}

export function productInCategory(product: Product, category: ShopCategoryId) {
  if (category === "all") return true;
  return productKind(product) === category;
}

export function categoryBadge(product: Product) {
  const id = productKind(product);
  return SHOP_CATEGORIES.find((c) => c.id === id)?.label ?? "Components";
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
