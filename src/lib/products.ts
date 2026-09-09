export type ShippingOption = {
  id: string;
  label: string;
  price: number;
};

export type ProductAttribute = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  title: string;
  categoryPath: string | null;
  categoryNumber: string | null;
  categoryName: string | null;
  priceLabel: string;
  amount: number;
  buyNow: boolean;
  photo: string | null;
  photos: string[];
  region: string | null;
  suburb: string | null;
  listingUrl: string;
  isNew: boolean;
  shipping: ShippingOption[];
  maxQty: number;
  description: string | null;
  attributes: ProductAttribute[];
  viewCount: number | null;
};

export type Seller = {
  nickname: string;
  region: string | null;
  suburb: string | null;
  positive: number;
  negative: number;
  feedback: number;
};

export type Catalog = {
  products: Product[];
  seller: Seller | null;
  error?: string;
};

export const nzd = (amount: number) =>
  new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(
    amount,
  );

export const NORTH_ISLAND = [
  "Northland",
  "Auckland",
  "Waikato",
  "Bay of Plenty",
  "Gisborne",
  "Hawke's Bay",
  "Taranaki",
  "Manawatū-Whanganui",
  "Wellington",
] as const;

export const SOUTH_ISLAND = [
  "Tasman",
  "Nelson",
  "Marlborough",
  "West Coast",
  "Canterbury",
  "Otago",
  "Southland",
] as const;

export const NZ_REGIONS = [...NORTH_ISLAND, ...SOUTH_ISLAND] as const;

export type Island = "north" | "south" | "unknown";

export function islandForRegion(region: string): Island {
  const folded = region.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  if (folded.includes("manawatu") || folded.includes("whanganui")) return "north";
  if ((NORTH_ISLAND as readonly string[]).includes(region)) return "north";
  if ((SOUTH_ISLAND as readonly string[]).includes(region)) return "south";
  return "unknown";
}

export function preferredShippingId(
  shipping: ShippingOption[],
  island: Island,
): string | undefined {
  if (shipping.length === 0) return undefined;
  if (island === "north") {
    const match = shipping.find((s) => /north island/i.test(s.label));
    if (match) return match.id;
  }
  if (island === "south") {
    const match = shipping.find((s) => /south island/i.test(s.label));
    if (match) return match.id;
  }
  const nonPickup = shipping.find((s) => !/pick-?up/i.test(s.label));
  return (nonPickup ?? shipping[0]).id;
}

export function categoryLabel(path: string | null | undefined): string | null {
  if (!path) return null;
  const last = path.split("/").filter(Boolean).slice(-1)[0];
  return last ? last.replace(/-/g, " ") : null;
}
