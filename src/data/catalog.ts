export type BranchId = "computas" | "apparel" | "software";

export type SkuCode = "DSKTP" | "LPTOP" | "CMPNT" | "APARL" | "SFTWR";

export const SKU_LABELS: {
  code: SkuCode;
  name: string;
  branch: BranchId;
  hint: string;
}[] = [
  { code: "DSKTP", name: "Desktops", branch: "computas", hint: "Towers and SFF machines" },
  { code: "LPTOP", name: "Laptops", branch: "computas", hint: "Notebooks and portables" },
  { code: "CMPNT", name: "Components", branch: "computas", hint: "Parts, drives, CPUs, cards" },
  { code: "APARL", name: "Apparel", branch: "apparel", hint: "Second-life clothing" },
  { code: "SFTWR", name: "Software", branch: "software", hint: "Digital tools" },
];

export function skuForCategory(branch: BranchId, category: string): SkuCode {
  if (branch === "apparel") return "APARL";
  if (branch === "software") return "SFTWR";
  if (category === "Desktops") return "DSKTP";
  if (category === "Laptops") return "LPTOP";
  return "CMPNT";
}

/** Standard apparel sizes for interest forms when a product has no sizes. */
export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "2XL"] as const;

/** Shipping line from Trade Me listing detail (ShippingOptions). */
export type ShippingOption = {
  id: string | number;
  label: string;
  price: number;
  /** free | custom | undecided | pickup | other */
  type: "free" | "custom" | "undecided" | "pickup" | "other";
};

export type Product = {
  id: string;
  branch: BranchId;
  title: string;
  price: number;
  category: string;
  image: string;
  blurb: string;
  specs: string[];
  condition: string;
  listingId?: string;
  images?: string[];
  sku?: SkuCode;
  sizes?: string[];
  madeToOrder?: boolean;
  /** Trade Me shipping options when available */
  shippingOptions?: ShippingOption[];
};

export function skuFor(product: Product): SkuCode {
  return product.sku ?? skuForCategory(product.branch, product.category);
}

export const BRANCHES: {
  id: BranchId;
  name: string;
  kicker: string;
  tagline: string;
  href: string;
  tone: string;
}[] = [
  {
    id: "computas",
    name: "Computas",
    kicker: "Hardware",
    tagline: "Refurbished PCs, parts and tested gear — kept in use, not in landfill.",
    href: "/computas",
    tone: "computas",
  },
  {
    id: "apparel",
    name: "Apparel",
    kicker: "Second-life",
    tagline: "Near-new 2nd-life clothing. Wear that's already made, still got years in it.",
    href: "/apparel",
    tone: "apparel",
  },
  {
    id: "software",
    name: "Software",
    kicker: "Digital",
    tagline: "Tools, store apps and upcoming Looters software products.",
    href: "/software",
    tone: "software",
  },
];

/** Empty — live products come only from Trade Me via TRADEME_CONSUMER_KEY / TRADEME_CONSUMER_SECRET */
export const COMPUTAS_PRODUCTS: Product[] = [];
export const APPAREL_PRODUCTS: Product[] = [];
export const SOFTWARE_PRODUCTS: Product[] = [];
export const ALL_PRODUCTS: Product[] = [];

export function getProduct(_id: string): Product | undefined {
  return undefined;
}

export function productImages(product: Product) {
  if (product.images && product.images.length > 0) return product.images;
  return [product.image];
}

export const SIFTA = {
  name: "Sifta Browser",
  url: "https://siftabrowser-looters-group.vercel.app",
  download: "https://github.com/gjphillips555/Sifta-WebApp/releases/latest",
  windows:
    "https://github.com/gjphillips555/Sifta-WebApp/releases/latest/download/SiftaBrowser-Windows.zip",
  linux:
    "https://github.com/gjphillips555/Sifta-WebApp/releases/latest/download/SiftaBrowser-Linux-x64.tar.gz",
  features: [
    { href: "/slots", label: "SiftaSlots" },
    { href: "/games", label: "Games" },
    { href: "/vpn", label: "VPN" },
    { href: "/qr", label: "QR" },
    { href: "/tv", label: "Sifta TV" },
    { href: "/extensions", label: "Extensions" },
    { href: "/ikwik", label: "IKWIK" },
  ],
} as const;

export const STORE = {
  name: "Looters Computas",
  group: "Refurbished computers online",
  address: ["Wellington", "New Zealand"],
  afterpay: true,
  warranty:
    "90-day return-to-base hardware warranty on most Computas listings (unless sold as-is).",
};

export const NEWS = [
  {
    source: "TechPowerUp",
    title: "Dell launches affordable Intel Core Series 3-powered Dell 15 laptop",
    date: "19 Aug 2026",
  },
  {
    source: "TechPowerUp",
    title: "OpenMouse previews open-source keyboard configuration with Wooting 60HE+ support",
    date: "19 Aug 2026",
  },
  {
    source: "TechPowerUp",
    title: "CachyOS and AlmaLinux beat Windows 11 in workstation benchmarks",
    date: "19 Aug 2026",
  },
  {
    source: "Tom's Hardware",
    title: "Samsung raises advanced foundry prices by up to 15% as AI demand fills 4nm lines",
    date: "19 Aug 2026",
  },
  {
    source: "Tom's Hardware",
    title: "Qualcomm retracts select Snapdragon C power-efficiency benchmarks",
    date: "19 Aug 2026",
  },
  {
    source: "TechPowerUp",
    title: "Linux 7.3 scheduler improvements lift FPS on low-power PCs",
    date: "19 Aug 2026",
  },
];
