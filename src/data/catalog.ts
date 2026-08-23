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

export const COMPUTAS_PRODUCTS: Product[] = [
  {
    id: "6090353257",
    branch: "computas",
    title: "HP ProDesk 400 G4 SFF — Intel Core i5 Business Desktop",
    price: 299.95,
    category: "Desktops",
    image: "/brand/products/6090353257.jpg",
    listingId: "6090353257",
    condition: "Refurbished · fully tested",
    blurb:
      "Compact small-form-factor business desktop. Clean install, quiet, and ready for office work, study, MYOB/Xero, Teams and everyday use. Includes a 90-day return-to-base hardware warranty.",
    specs: [
      "CPU: Intel Core i5-7500 (4 cores, 3.4GHz / 3.8GHz turbo)",
      "RAM: 8GB DDR4",
      "Storage: 250GB SSD",
      "Graphics: Intel HD 630",
      "OS: Windows 10/11 Pro (activated)",
      "Form factor: Small Form Factor (SFF)",
      "Includes: Power cable",
      "Pickup: Upper Hutt / Kilbirnie · courier nationwide",
    ],
  },
  {
    id: "6090353205",
    branch: "computas",
    title: "Refurbished Dell OptiPlex 9020 — i5 / 8GB / SSD + 1TB HDD / Windows 11 Pro",
    price: 299.95,
    category: "Desktops",
    image: "/brand/products/6090353205.jpg",
    listingId: "6090353205",
    condition: "Refurbished · dual storage",
    blurb:
      "Workhorse OptiPlex with a fast SSD for boot plus a 1TB HDD for files. Windows 11 Pro activated. Tested before listing — a practical home or small-business machine.",
    specs: [
      "CPU: Intel Core i5",
      "RAM: 8GB",
      "Storage: SSD + 1TB HDD",
      "OS: Windows 11 Pro",
      "90-day return-to-base hardware warranty",
    ],
  },
  {
    id: "6090353174",
    branch: "computas",
    title: "Toshiba 256GB SATA SSD — Used",
    price: 44,
    category: "Storage",
    image: "/brand/products/6090353174.jpg",
    listingId: "6090353174",
    condition: "Used · tested",
    blurb: "Used 256GB 2.5\" SATA SSD. A simple way to speed up an older laptop or desktop.",
    specs: ["Capacity: 256GB", "Interface: SATA", "Form: 2.5\""],
  },
  {
    id: "6090353245",
    branch: "computas",
    title: "Solidata 128GB Flash SSD — 2.5\" SATA — Tested",
    price: 34.95,
    category: "Storage",
    image: "/brand/products/6090353245.jpg",
    listingId: "6090353245",
    condition: "Tested",
    blurb: "Compact 128GB SATA SSD for boot drives, upgrades and spare machines.",
    specs: ["Capacity: 128GB", "Interface: SATA", "Form: 2.5\""],
  },
  {
    id: "6090353193",
    branch: "computas",
    title: "WD Black 2.5\" 500GB Hard Drive — SATA — Tested & Reliable",
    price: 34.95,
    category: "Storage",
    image: "/brand/products/6090353193.jpg",
    listingId: "6090353193",
    condition: "Tested",
    blurb: "Known-good 500GB WD Black laptop drive. Tested before listing.",
    specs: ["Capacity: 500GB", "Interface: SATA", "Form: 2.5\""],
  },
  {
    id: "6090353213",
    branch: "computas",
    title: "Toshiba 2.5\" 250GB Hard Drive — SATA — Tested & Reliable",
    price: 29.95,
    category: "Storage",
    image: "/brand/products/6090353213.jpg",
    listingId: "6090353213",
    condition: "Tested",
    blurb: "250GB 2.5\" SATA drive, tested and ready as a spare or extra storage.",
    specs: ["Capacity: 250GB", "Interface: SATA", "Form: 2.5\""],
  },
  {
    id: "6066737948",
    branch: "computas",
    title: "HGST 2.5\" 500GB Hard Drive HDD",
    price: 29.95,
    category: "Storage",
    image: "/brand/products/6066737948.jpg",
    listingId: "6066737948",
    condition: "Used · tested",
    blurb: "500GB HGST laptop drive. Still useful as a data disk or spare.",
    specs: ["Capacity: 500GB", "Interface: SATA", "Form: 2.5\""],
  },
  {
    id: "6090353279",
    branch: "computas",
    title: "2.5\" External Hard Drive Enclosure",
    price: 13,
    category: "Storage",
    image: "/brand/products/6090353279.jpg",
    listingId: "6090353279",
    condition: "Used",
    blurb: "Turn a 2.5\" SATA drive into a USB external. Handy for backups and spare disks.",
    specs: ["Fits 2.5\" SATA", "USB enclosure"],
  },
  {
    id: "6090353185",
    branch: "computas",
    title: "Intel Core i3-3220 — 3.3GHz Dual-Core CPU — LGA1155",
    price: 9.95,
    category: "CPUs",
    image: "/brand/products/6090353185.jpg",
    listingId: "6090353185",
    condition: "Used · tested",
    blurb: "LGA1155 i3 for a cheap rebuild or spare. Tested.",
    specs: ["Intel Core i3-3220", "3.3GHz dual-core", "Socket LGA1155"],
  },
  {
    id: "6090353199",
    branch: "computas",
    title: "Intel Core i5-2400 — 3.1GHz Quad-Core CPU — LGA1155",
    price: 9.95,
    category: "CPUs",
    image: "/brand/products/6090353199.jpg",
    listingId: "6090353199",
    condition: "Used · tested",
    blurb: "Quad-core LGA1155 i5. A cheap way to keep an older machine useful.",
    specs: ["Intel Core i5-2400", "3.1GHz quad-core", "Socket LGA1155"],
  },
  {
    id: "6090353163",
    branch: "computas",
    title: "Intel Core i3-2100 — 3.1GHz Dual-Core CPU — LGA1155",
    price: 14.95,
    category: "CPUs",
    image: "/brand/products/6090353163.jpg",
    listingId: "6090353163",
    condition: "Used · tested",
    blurb: "LGA1155 i3-2100, tested. Spare silicon instead of e-waste.",
    specs: ["Intel Core i3-2100", "3.1GHz dual-core", "Socket LGA1155"],
  },
  {
    id: "6090353268",
    branch: "computas",
    title: "Nvidia Quadro NVS 290 256MB DDR2 PCIe — HP 456137-001",
    price: 24.95,
    category: "Graphics",
    image: "/brand/products/6090353268.jpg",
    listingId: "6090353268",
    condition: "Tested",
    blurb: "Low-profile workstation display card. Dual-output office graphics, tested.",
    specs: ["Nvidia Quadro NVS 290", "256MB DDR2", "PCIe", "HP P/N 456137-001"],
  },
  {
    id: "6066736433",
    branch: "computas",
    title: "3 Port 1394A PCI Card",
    price: 19.95,
    category: "Components",
    image: "/brand/products/6066736433.jpg",
    listingId: "6066736433",
    condition: "Used",
    blurb: "FireWire 1394A PCI card — three ports for older cameras, audio and disks.",
    specs: ["3× 1394A ports", "PCI"],
  },
  {
    id: "6090353220",
    branch: "computas",
    title: "Apple iPhone 6 — A1586 — 16GB",
    price: 22,
    category: "Phones",
    image: "/brand/products/6090353220.jpg",
    listingId: "6090353220",
    condition: "Used · second-life",
    blurb: "iPhone 6 16GB. Sold as a spare, parts phone or a cheap second device — not a flagship.",
    specs: ["Model A1586", "16GB", "Check listing for grade"],
  },
];

export const APPAREL_SIZES = ["S", "M", "L", "XL", "2XL"] as const;

export const APPAREL_PRODUCTS: Product[] = [
  {
    id: "hoodie-offline",
    branch: "apparel",
    title: "Looters hoodie — OFFLINE · black",
    price: 89,
    category: "Hoodies",
    image: "/brand/apparel/hoodie-offline.jpg",
    images: [
      "/brand/apparel/hoodie-offline.jpg",
      "/brand/apparel/hoodie-sleeve.jpg",
      "/brand/apparel/print-looters.jpg",
    ],
    condition: "Coming to Trade Me",
    madeToOrder: true,
    sizes: [...APPAREL_SIZES],
    sku: "APARL",
    blurb:
      "Same chest graphic as the tee — glitch skull, gothic LOOTERS, nothing useful goes to waste — plus OFFLINE down the sleeve. Leave your size; we’ll list it on Trade Me.",
    specs: [
      "Coming to Trade Me",
      "Chest: Looters Group graphic",
      "Left sleeve: OFFLINE",
      "Heavyweight pullover",
      "Sizes S–2XL",
    ],
  },
  {
    id: "tee-looters",
    branch: "apparel",
    title: "Looters tee — glitch skull · cream",
    price: 45,
    category: "Tees",
    image: "/brand/apparel/tee.jpg",
    images: ["/brand/apparel/tee.jpg", "/brand/apparel/print-looters.jpg"],
    condition: "Coming to Trade Me",
    madeToOrder: true,
    sizes: [...APPAREL_SIZES],
    sku: "APARL",
    blurb:
      "The cream tee with the glitch skull. Same graphic as the hoodie, without the sleeve. Leave your size; we’ll list it on Trade Me.",
    specs: [
      "Coming to Trade Me",
      "Chest: Looters Group graphic",
      "Heavyweight cotton",
      "Sizes S–2XL",
    ],
  },
  {
    id: "hoodie-black",
    branch: "apparel",
    title: "Second-life hoodie — black · near new",
    price: 39,
    category: "Hoodies",
    image: "/brand/apparel/hoodie.jpg",
    condition: "Second-life · near new",
    blurb:
      "Heavyweight hoodie with life left in it. Cleaned, checked, ready to wear. Nothing useful goes in a bin if we can pass it on.",
    specs: ["Near-new condition", "Heavyweight fleece", "Unisex", "Ask in store for size"],
  },
  {
    id: "crew-purple",
    branch: "apparel",
    title: "Second-life crew — deep purple · near new",
    price: 32,
    category: "Sweats",
    image: "/brand/apparel/crew.jpg",
    condition: "Second-life · near new",
    blurb: "Crewneck in Looters purple. Near-new, no loud graphics, years left in the fabric.",
    specs: ["Near-new condition", "Brushed fleece", "Unisex"],
  },
  {
    id: "cap-black",
    branch: "apparel",
    title: "Second-life cap — black · near new",
    price: 14,
    category: "Hats",
    image: "/brand/apparel/cap.jpg",
    condition: "Second-life · near new",
    blurb: "Structured cap, cleaned and checked. One more season — or five — instead of landfill.",
    specs: ["Near-new condition", "Adjustable", "One size"],
  },
  {
    id: "tote-canvas",
    branch: "apparel",
    title: "Second-life canvas tote · near new",
    price: 12,
    category: "Bags",
    image: "/brand/apparel/tote.jpg",
    condition: "Second-life · near new",
    blurb: "Heavy canvas tote still going strong. For parts runs, groceries, or a laptop.",
    specs: ["Near-new condition", "Heavy canvas", "Long handles"],
  },
];

export const SOFTWARE_PRODUCTS: Product[] = [
  {
    id: "sifta-notes",
    branch: "software",
    title: "Looters Notes — Local first",
    price: 0,
    category: "Apps",
    image: "/brand/software-hero.jpg",
    condition: "In development",
    blurb: "A lightweight notes app that stays on your machine. No account required for the local vault.",
    specs: ["Offline first", "Export Markdown", "Coming to the Software branch"],
  },
];

export const ALL_PRODUCTS: Product[] = [
  ...COMPUTAS_PRODUCTS,
  ...APPAREL_PRODUCTS,
  ...SOFTWARE_PRODUCTS,
];

export function getProduct(id: string) {
  return ALL_PRODUCTS.find((p) => p.id === id);
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
  name: "Looters",
  group: "A Purple Penguin Company",
  address: ["6 Ruru Avenue", "Kilbirnie, Wellington 6022", "New Zealand"],
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
