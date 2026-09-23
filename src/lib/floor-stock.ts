import { nzd, type Product } from "@/lib/products";

type Kind = "desktops" | "laptops" | "components";

type Spec = {
  id: string;
  title: string;
  kind: Kind;
  amount: number;
  photo: string;
  description: string;
  attributes: { name: string; value: string }[];
};

const PATH: Record<Kind, { path: string; number: string; name: string }> = {
  desktops: {
    path: "/Computers/Desktops",
    number: "0002-4715",
    name: "Desktops",
  },
  laptops: {
    path: "/Computers/Laptops",
    number: "0002-0356",
    name: "Laptops",
  },
  components: {
    path: "/Computers/Components",
    number: "0002-0359",
    name: "Components",
  },
};

const SPECS: Spec[] = [
  {
    id: "sold-9101",
    kind: "desktops",
    photo: "/artwork/floor/d1.jpg",
    amount: 349,
    title: 'Dell OptiPlex 7070 SFF – i5-9500 | 16GB | 256GB NVMe | Windows 11 Pro | "D3"',
    description:
      "Refurbished small-form business desktop. Wiped, stress-tested and loaded with Windows 11 Pro. Quiet enough for a desk, with room for a second drive if you need it later. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-9500" },
      { name: "Memory", value: "16GB DDR4" },
      { name: "Storage", value: "256GB NVMe SSD" },
      { name: "Form factor", value: "Small form factor" },
    ],
  },
  {
    id: "sold-9102",
    kind: "desktops",
    photo: "/artwork/floor/d2.jpg",
    amount: 429,
    title: 'HP EliteDesk 800 G5 Mini – i5-9500T | 16GB | 512GB | Windows 11 Pro | "D3"',
    description:
      "Tiny refurbished office PC. Sits behind a monitor and still handles everyday work, browsing and light multitasking. Fresh Windows 11 Pro install. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-9500T" },
      { name: "Memory", value: "16GB DDR4" },
      { name: "Storage", value: "512GB SSD" },
      { name: "Form factor", value: "Mini" },
    ],
  },
  {
    id: "sold-9103",
    kind: "desktops",
    photo: "/artwork/floor/d3.jpg",
    amount: 379,
    title: 'Lenovo ThinkCentre M720q Tiny – i5-8400T | 16GB | 256GB | Windows 11 | "D3"',
    description:
      "Refurbished Lenovo tiny desktop. Tested for a clean boot, stable temps and working ports. Windows 11 installed. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-8400T" },
      { name: "Memory", value: "16GB DDR4" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Form factor", value: "Tiny" },
    ],
  },
  {
    id: "sold-9104",
    kind: "desktops",
    photo: "/artwork/floor/d4.jpg",
    amount: 899,
    title: 'Ryzen 5 5600 Gaming PC – 16GB | 512GB NVMe | Radeon RX 6600 | "D3"',
    description:
      "Refurbished gaming tower built for 1080p. Ryzen 5 5600, 16GB RAM and an RX 6600, with a clean Windows 11 install. Case, fans and thermals checked before it left the bench. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "AMD Ryzen 5 5600" },
      { name: "Graphics", value: "Radeon RX 6600 8GB" },
      { name: "Memory", value: "16GB DDR4" },
      { name: "Storage", value: "512GB NVMe" },
    ],
  },
  {
    id: "sold-9105",
    kind: "desktops",
    photo: "/artwork/floor/d5.jpg",
    amount: 649,
    title: 'Dell Precision 3630 Workstation – i7-9700 | 32GB | 512GB | Quadro | "D3"',
    description:
      "Refurbished workstation for CAD, photo work and heavier office loads. 32GB RAM, NVMe storage and a Quadro card. Windows 11 Pro. Burned in before sale. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i7-9700" },
      { name: "Memory", value: "32GB DDR4" },
      { name: "Graphics", value: "NVIDIA Quadro" },
      { name: "Storage", value: "512GB NVMe" },
    ],
  },
  {
    id: "sold-9201",
    kind: "laptops",
    photo: "/artwork/floor/l1.jpg",
    amount: 449,
    title: 'Dell Latitude 5420 14" – i5-1145G7 | 16GB | 256GB | Windows 11 Pro | "L4"',
    description:
      "Refurbished 14-inch Latitude. Battery holds a charge, keyboard and screen checked, Windows 11 Pro freshly installed. Includes charger. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-1145G7" },
      { name: "Memory", value: "16GB" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Screen", value: '14"' },
    ],
  },
  {
    id: "sold-9202",
    kind: "laptops",
    photo: "/artwork/floor/l2.jpg",
    amount: 479,
    title: 'HP EliteBook 840 G8 – i5-1135G7 | 16GB | 256GB | Windows 11 Pro | "L4"',
    description:
      "Refurbished EliteBook for work and study. Screen, keyboard, trackpad and Wi-Fi tested. Windows 11 Pro. Charger included. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-1135G7" },
      { name: "Memory", value: "16GB" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Screen", value: '14"' },
    ],
  },
  {
    id: "sold-9203",
    kind: "laptops",
    photo: "/artwork/floor/l3.jpg",
    amount: 329,
    title: 'Lenovo ThinkPad T480 – i5-8350U | 16GB | 256GB SSD | Windows 11 | "L4"',
    description:
      "Refurbished ThinkPad T480. Classic keyboard, tested battery and a clean Windows 11 install. Charger included. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-8350U" },
      { name: "Memory", value: "16GB" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Screen", value: '14"' },
    ],
  },
  {
    id: "sold-9204",
    kind: "laptops",
    photo: "/artwork/floor/l4.jpg",
    amount: 549,
    title: 'Lenovo ThinkPad X1 Carbon Gen 6 – i5 | 16GB | 256GB | Windows 11 | "L4"',
    description:
      "Refurbished thin ThinkPad. Light enough for a bag, tested for a clean boot and a working battery. Windows 11. Charger included. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5" },
      { name: "Memory", value: "16GB" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Screen", value: '14"' },
    ],
  },
  {
    id: "sold-9205",
    kind: "laptops",
    photo: "/artwork/floor/l5.jpg",
    amount: 399,
    title: 'HP ProBook 450 G8 15.6" – i5-1135G7 | 8GB | 256GB | Windows 11 | "L4"',
    description:
      "Refurbished 15.6-inch ProBook. Everyday laptop for study and office work. Screen and keyboard checked, Windows 11 installed, charger included. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-1135G7" },
      { name: "Memory", value: "8GB" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Screen", value: '15.6"' },
    ],
  },
  {
    id: "sold-9301",
    kind: "components",
    photo: "/artwork/floor/c1.jpg",
    amount: 289,
    title: 'NVIDIA GeForce RTX 3060 12GB GDDR6 Graphics Card – Tested | "C0"',
    description:
      "Pulled from a working PC, cleaned and tested with a short graphics load. 12GB card for 1080p gaming. No box. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Chipset", value: "NVIDIA GeForce RTX 3060" },
      { name: "Memory", value: "12GB GDDR6" },
      { name: "Outputs", value: "DisplayPort / HDMI" },
      { name: "Condition", value: "Refurbished, tested" },
    ],
  },
  {
    id: "sold-9302",
    kind: "components",
    photo: "/artwork/floor/c2.jpg",
    amount: 219,
    title: 'AMD Radeon RX 6600 8GB Graphics Card – Tested | "C0"',
    description:
      "Refurbished RX 6600. Fans spin, display output checked, and the card completed a short load test. No box. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Chipset", value: "AMD Radeon RX 6600" },
      { name: "Memory", value: "8GB GDDR6" },
      { name: "Condition", value: "Refurbished, tested" },
    ],
  },
  {
    id: "sold-9303",
    kind: "components",
    photo: "/artwork/floor/c3.jpg",
    amount: 149,
    title: 'NVIDIA GeForce GTX 1660 Super 6GB Graphics Card – Tested | "C0"',
    description:
      "Short refurbished GTX 1660 Super. Fine for older games and a second PC. Display output tested. No box. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Chipset", value: "NVIDIA GeForce GTX 1660 Super" },
      { name: "Memory", value: "6GB GDDR6" },
      { name: "Condition", value: "Refurbished, tested" },
    ],
  },
  {
    id: "sold-9304",
    kind: "components",
    photo: "/artwork/floor/c4.jpg",
    amount: 69,
    title: '16GB DDR4 3200MHz Memory Kit (2x8GB) – Tested | "C0"',
    description:
      "Matched 2x8GB DDR4 kit. Passed a memory test before it was listed. 90-day warranty. This kit has sold.",
    attributes: [
      { name: "Capacity", value: "16GB (2x8GB)" },
      { name: "Type", value: "DDR4 3200MHz" },
      { name: "Condition", value: "Tested" },
    ],
  },
  {
    id: "sold-9305",
    kind: "components",
    photo: "/artwork/floor/c5.jpg",
    amount: 79,
    title: '500GB NVMe SSD – M.2 2280 – Health Checked | "C0"',
    description:
      "Used NVMe drive with healthy reported life left. Wiped before listing. 90-day warranty. This drive has sold.",
    attributes: [
      { name: "Capacity", value: "500GB" },
      { name: "Interface", value: "M.2 NVMe" },
      { name: "Condition", value: "Health checked, wiped" },
    ],
  },
  {
    id: "sold-9306",
    kind: "components",
    photo: "/artwork/floor/c6.jpg",
    amount: 89,
    title: 'Intel Core i5-10400 6-Core CPU – LGA1200 – Tested | "C0"',
    description:
      "Pulled i5-10400. Posted in a test board before sale. No cooler included. 90-day warranty. This CPU has sold.",
    attributes: [
      { name: "Processor", value: "Intel Core i5-10400" },
      { name: "Socket", value: "LGA1200" },
      { name: "Cores", value: "6 cores / 12 threads" },
    ],
  },
  {
    id: "sold-9307",
    kind: "components",
    photo: "/artwork/floor/c7.jpg",
    amount: 79,
    title: '650W ATX Power Supply – Tested | "C0"',
    description:
      "Refurbished 650W ATX power supply. Rails checked under load on the bench. Cables included. 90-day warranty. This unit has sold.",
    attributes: [
      { name: "Wattage", value: "650W" },
      { name: "Form", value: "ATX" },
      { name: "Condition", value: "Tested" },
    ],
  },
  {
    id: "sold-9308",
    kind: "components",
    photo: "/artwork/floor/c8.jpg",
    amount: 35,
    title: 'CPU Air Cooler – 120mm Fan – Tested | "C0"',
    description:
      "Used tower cooler. Fan spins true and the mounting hardware is included. 90-day warranty. This cooler has sold.",
    attributes: [
      { name: "Type", value: "Tower air cooler" },
      { name: "Fan", value: "120mm" },
      { name: "Condition", value: "Tested" },
    ],
  },
];

function toProduct(spec: Spec): Product {
  const cat = PATH[spec.kind];
  return {
    id: spec.id,
    title: spec.title,
    categoryPath: cat.path,
    categoryNumber: cat.number,
    categoryName: cat.name,
    priceLabel: nzd(spec.amount),
    amount: spec.amount,
    buyNow: false,
    photo: spec.photo,
    photos: [spec.photo],
    region: null,
    suburb: null,
    listingUrl: "",
    isNew: false,
    shipping: [],
    maxQty: 0,
    description: spec.description,
    attributes: spec.attributes,
    viewCount: null,
    soldOut: true,
  };
}

/** Sold display stock. Not copied from live Trade Me listings, and not linked anywhere. */
export const FLOOR_STOCK: Product[] = SPECS.map(toProduct);
