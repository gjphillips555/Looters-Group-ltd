import { nzd, type Product, type ShippingOption } from "@/lib/products";

/** Advertised NZ supply price + 7%. Not shown to customers. */
const sell = (cost: number) => Math.round(cost * 107) / 100;

const SHIP: ShippingOption[] = [
  { id: "north", label: "North Island courier", price: 8.5 },
  { id: "south", label: "South Island courier", price: 12.5 },
];

type Kind = "batteries" | "ink" | "components";

type Row = {
  id: string;
  kind: Kind;
  cost: number;
  title: string;
  photo: string;
  brand: string;
  fit: string;
  genuine?: boolean;
  shipping?: ShippingOption[];
};

const PHOTO = {
  hpBat: "/artwork/sourced/hp-battery.jpg",
  dellBat: "/artwork/sourced/dell-battery.jpg",
  hpCharger: "/artwork/sourced/hp-charger.jpg",
  dellCharger: "/artwork/sourced/dell-charger.jpg",
  lenovoCharger: "/artwork/sourced/lenovo-charger.jpg",
  hp67: "/artwork/sourced/hp-67xl.jpg",
  canon: "/artwork/sourced/canon-ink.jpg",
  lc38: "/artwork/sourced/lc38.jpg",
  lc67: "/artwork/sourced/lc67.jpg",
  lc233: "/artwork/sourced/lc233.jpg",
  lc73: "/artwork/sourced/lc73.jpg",
  lc133: "/artwork/sourced/lc133.jpg",
  lc431bk: "/artwork/sourced/lc431bk.jpg",
  lc431y: "/artwork/sourced/lc431y.jpg",
  lc3319: "/artwork/sourced/lc3319.jpg",
  lc3313: "/artwork/sourced/lc3313.jpg",
  gt710: "/artwork/sourced/gt710.jpg",
  rtx3050: "/artwork/sourced/rtx3050.jpg",
  b570: "/artwork/sourced/b570.jpg",
  rx9060: "/artwork/sourced/rx9060.jpg",
} as const;

const GPU_SHIP: ShippingOption[] = [
  { id: "north", label: "North Island courier", price: 15 },
  { id: "south", label: "South Island courier", price: 22 },
];

/**
 * Cheap NZ lines we can reorder (Sunny Way Tech batteries/chargers, Good Egg ink).
 * Costs are their advertised inc-GST prices. Sell price is cost + 7%.
 */
const ROWS: Row[] = [
  { id: "src-9401", kind: "batteries", cost: 36, photo: "hpBat", brand: "HP", fit: "HP 240 / 245 / 255 G4", title: "Compatible Laptop Battery for HP 240 245 255 G4 – HS04 HSTNN-LB6V" },
  { id: "src-9402", kind: "batteries", cost: 33.6, photo: "hpBat", brand: "HP", fit: "HP Pavilion 14 / 15", title: "Compatible Laptop Battery for HP Pavilion 14/15 – HT03XL L1119-855" },
  { id: "src-9403", kind: "batteries", cost: 38.4, photo: "hpBat", brand: "HP", fit: "HP RI06XL", title: "Compatible Laptop Battery for HP – RI06XL" },
  { id: "src-9404", kind: "batteries", cost: 45.6, photo: "hpBat", brand: "HP", fit: "HP CA06", title: "Compatible Laptop Battery for HP – CA06" },
  { id: "src-9405", kind: "batteries", cost: 54, photo: "hpBat", brand: "HP", fit: "HP EliteBook", title: "Compatible Laptop Battery for HP EliteBook – HSTNN-IB6Y" },
  { id: "src-9406", kind: "batteries", cost: 50.4, photo: "hpBat", brand: "HP", fit: "HP EliteBook", title: "Compatible Laptop Battery for HP EliteBook – HSTNN-IB3Z" },
  { id: "src-9407", kind: "batteries", cost: 57.6, photo: "hpBat", brand: "HP", fit: "HP KC04XL", title: "Compatible Laptop Battery for HP – KC04XL" },
  { id: "src-9408", kind: "batteries", cost: 57.6, photo: "hpBat", brand: "HP", fit: "HP Pavilion Gaming 15-dk", title: "Compatible Laptop Battery for HP Pavilion Gaming 15 – PG03XL 52.5Wh" },
  { id: "src-9409", kind: "batteries", cost: 62.4, photo: "hpBat", brand: "HP", fit: "HP VR03XL", title: "Compatible Laptop Battery for HP – VR03XL" },
  { id: "src-9410", kind: "batteries", cost: 48, photo: "hpBat", brand: "HP", fit: "HP SS03XL", title: "Compatible Laptop Battery for HP – SS03XL" },
  { id: "src-9411", kind: "batteries", cost: 25.2, photo: "hpCharger", brand: "HP", fit: "HP 45W 4.5×3.0mm", title: "Compatible Laptop Charger for HP 45W 19.5V 4.5×3.0mm" },
  { id: "src-9412", kind: "batteries", cost: 25.2, photo: "hpCharger", brand: "HP", fit: "HP 65W 4.5×3.0mm", title: "Compatible Laptop Charger for HP 65W 19.5V 4.5×3.0mm" },
  { id: "src-9413", kind: "batteries", cost: 46.8, photo: "dellBat", brand: "Dell", fit: "Dell H5CKD", title: "Compatible Laptop Battery for Dell – H5CKD" },
  { id: "src-9414", kind: "batteries", cost: 45.6, photo: "dellBat", brand: "Dell", fit: "Dell YRDD6 / 1VX1H", title: "Compatible Laptop Battery for Dell – YRDD6 1VX1H" },
  { id: "src-9415", kind: "batteries", cost: 48, photo: "dellBat", brand: "Dell", fit: "Dell JK6Y6", title: "Compatible Laptop Battery for Dell – JK6Y6" },
  { id: "src-9416", kind: "batteries", cost: 54, photo: "dellBat", brand: "Dell", fit: "Dell Latitude 12", title: "Compatible Laptop Battery for Dell Latitude 12 – DJ1J0" },
  { id: "src-9417", kind: "batteries", cost: 51.6, photo: "dellBat", brand: "Dell", fit: "Dell JHT2H", title: "Compatible Laptop Battery for Dell – JHT2H" },
  { id: "src-9418", kind: "batteries", cost: 25.2, photo: "dellCharger", brand: "Dell", fit: "Dell 90W 7.4×5.0mm", title: "Compatible Laptop Charger for Dell 90W 19.5V 7.4×5.0mm" },
  { id: "src-9419", kind: "batteries", cost: 33.6, photo: "dellCharger", brand: "Dell", fit: "Dell 45W USB-C", title: "Compatible Laptop Charger for Dell 45W USB-C" },
  { id: "src-9420", kind: "batteries", cost: 36, photo: "dellCharger", brand: "Dell", fit: "Dell 65W USB-C", title: "Compatible Laptop Charger for Dell 65W USB-C" },
  { id: "src-9421", kind: "batteries", cost: 25.2, photo: "lenovoCharger", brand: "Lenovo", fit: "Lenovo 45W 4.0×1.7mm", title: "Compatible Laptop Charger for Lenovo 45W 20V 4.0×1.7mm" },
  { id: "src-9422", kind: "batteries", cost: 25.2, photo: "lenovoCharger", brand: "Lenovo", fit: "Lenovo 65W 4.0×1.7mm", title: "Compatible Laptop Charger for Lenovo 65W 20V 4.0×1.7mm" },

  { id: "src-9601", kind: "components", cost: 99, photo: "gt710", brand: "Gigabyte", fit: "Extra monitor or an old PC", title: "Gigabyte GeForce GT 710 2GB Graphics Card", shipping: GPU_SHIP },
  { id: "src-9602", kind: "components", cost: 439, photo: "rtx3050", brand: "MSI", fit: "1080p", title: "MSI GeForce RTX 3050 Ventus 2X OC 6GB Graphics Card", shipping: GPU_SHIP },
  { id: "src-9603", kind: "components", cost: 479, photo: "b570", brand: "ASRock", fit: "1080p and 1440p", title: "ASRock Intel Arc B570 Challenger OC 10GB Graphics Card", shipping: GPU_SHIP },
  { id: "src-9604", kind: "components", cost: 769, photo: "rx9060", brand: "XFX", fit: "1440p", title: "XFX Swift AMD Radeon RX 9060 XT 16GB Graphics Card", shipping: GPU_SHIP },

  { id: "src-9501", kind: "ink", cost: 6.56, photo: "lc38", brand: "Brother", fit: "Brother LC38 / LC67", title: "Compatible Brother LC38 LC67 Black Ink Cartridge" },
  { id: "src-9502", kind: "ink", cost: 9.06, photo: "lc233", brand: "Brother", fit: "Brother LC233", title: "Compatible Brother LC233 Black Ink Cartridge" },
  { id: "src-9503", kind: "ink", cost: 14.95, photo: "lc73", brand: "Brother", fit: "Brother LC73", title: "Compatible Brother LC73 Ink Cartridges – 4 Colour Value Pack" },
  { id: "src-9504", kind: "ink", cost: 19.95, photo: "lc133", brand: "Brother", fit: "Brother LC133", title: "Compatible Brother LC133 Ink Cartridges – 4 Colour High Yield Pack" },
  { id: "src-9505", kind: "ink", cost: 21.95, photo: "lc431bk", brand: "Brother", fit: "Brother LC431XL", title: "Compatible Brother LC431XL Black Ink Cartridge" },
  { id: "src-9506", kind: "ink", cost: 21.95, photo: "lc431y", brand: "Brother", fit: "Brother LC431XL", title: "Compatible Brother LC431XL Yellow Ink Cartridge" },
  { id: "src-9507", kind: "ink", cost: 22.95, photo: "lc233", brand: "Brother", fit: "Brother LC233", title: "Compatible Brother LC233 Ink Cartridges – 4 Colour Value Pack" },
  { id: "src-9508", kind: "ink", cost: 56.95, photo: "lc3319", brand: "Brother", fit: "Brother LC3319XL", title: "Compatible Brother LC3319XL Ink Cartridges – 4 Colour High Yield Pack" },
  { id: "src-9509", kind: "ink", cost: 53.95, photo: "lc3313", brand: "Brother", fit: "Brother LC3313BK", title: "Genuine Brother LC3313BK Black Ink Cartridge", genuine: true },
  { id: "src-9510", kind: "ink", cost: 15.95, photo: "canon", brand: "Canon", fit: "Canon MegaTank", title: "Canon MC-G02 MegaTank Maintenance Cartridge", genuine: true },
  { id: "src-9511", kind: "ink", cost: 56.9, photo: "canon", brand: "Canon", fit: "Canon PG-645XL", title: "Genuine Canon PG-645XL Black Ink Cartridge", genuine: true },
  { id: "src-9512", kind: "ink", cost: 58.93, photo: "canon", brand: "Canon", fit: "Canon CL-646XL", title: "Genuine Canon CL-646XL Colour Ink Cartridge", genuine: true },
  { id: "src-9513", kind: "ink", cost: 37.95, photo: "hp67", brand: "HP", fit: "HP 67", title: "Genuine HP 67 Black Ink Cartridge", genuine: true },
  { id: "src-9514", kind: "ink", cost: 57.95, photo: "hp67", brand: "HP", fit: "HP 67XL", title: "Genuine HP 67XL Black Ink Cartridge", genuine: true },
  { id: "src-9515", kind: "ink", cost: 45.95, photo: "hp67", brand: "HP", fit: "HP 63XL", title: "Remanufactured HP 63XL Black Ink Cartridge" },
];

const PATH = {
  batteries: {
    path: "/Computers/Laptop-Batteries",
    number: "0002-bat",
    name: "Batteries",
    stamp: "B4",
  },
  ink: {
    path: "/Computers/Printer-Ink",
    number: "0002-ink",
    name: "Ink",
    stamp: "I1",
  },
  components: {
    path: "/Computers/Components",
    number: "0002-gpu",
    name: "Components",
    stamp: "C0",
  },
} as const;

function toProduct(row: Row): Product {
  const cat = PATH[row.kind];
  const amount = sell(row.cost);
  const genuine = Boolean(row.genuine);
  return {
    id: row.id,
    title: `${row.title} | "${cat.stamp}"`,
    categoryPath: cat.path,
    categoryNumber: cat.number,
    categoryName: cat.name,
    priceLabel: nzd(amount),
    amount,
    buyNow: true,
    photo: PHOTO[row.photo as keyof typeof PHOTO],
    photos: [PHOTO[row.photo as keyof typeof PHOTO]],
    region: null,
    suburb: null,
    listingUrl: "",
    isNew: false,
    shipping: row.shipping ?? SHIP,
    maxQty: row.kind === "ink" ? 12 : 4,
    description:
      row.kind === "components"
        ? `New ${row.brand} card, bought in from a New Zealand shop when you order and posted from Wellington. ${row.id === "src-9601" ? "This is a basic display card for an extra screen or an old PC, not for modern games. " : ""}If that exact card has already sold there, you get a full refund before it ships.`
        : genuine
          ? `Genuine ${row.brand} ${row.fit}. Ordered in when you buy and posted from Wellington. If we cannot get this exact item, you get a full refund before it ships.`
          : `Compatible ${row.brand} replacement for ${row.fit}. Not a genuine OEM part. Ordered in when you buy and posted from Wellington. If we cannot get this exact part, you get a full refund before it ships.`,
    attributes: [
      { name: "Brand", value: row.brand },
      { name: "Fits", value: row.fit },
      { name: "Type", value: row.kind === "components" ? "New" : genuine ? "Genuine" : "Compatible" },
    ],
    viewCount: null,
    soldOut: false,
  };
}

export const SOURCED_STOCK: Product[] = ROWS.map(toProduct);
