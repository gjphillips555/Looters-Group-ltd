import { createServerFn } from "@tanstack/react-start";
import {
  categoryLabel,
  type Catalog,
  type Product,
  type Seller,
  type ShippingOption,
} from "@/lib/products";

export const MEMBER_ID = "9233545";
const API_BASE = "https://api.trademe.co.nz/v1";
const CACHE_MS = 5 * 60_000;
/** TradeMe top-level Computers category and every nested subcategory. */
const COMPUTERS_CATEGORY = "0002";

type TradeMeListing = {
  ListingId: number;
  Title: string;
  Category?: string;
  CategoryPath?: string;
  CategoryName?: string;
  StartPrice?: number;
  BuyNowPrice?: number;
  PriceDisplay?: string;
  PhotoUrls?: string[];
  PictureHref?: string;
  Region?: string;
  Suburb?: string;
  IsNew?: boolean;
  HasBuyNow?: boolean;
  MemberId?: number;
};

type TradeMeShippingOption = {
  Type?: string | number;
  Price?: number;
  Method?: string;
  ShippingId?: number;
};

type TradeMePhoto = {
  Value?: {
    FullSize?: string;
    PlusSize?: string;
    Large?: string;
    Gallery?: string;
    Medium?: string;
    List?: string;
  };
};

type TradeMeMember = {
  MemberId?: number;
  Nickname?: string;
  Region?: string;
  Suburb?: string;
  UniquePositive?: number;
  UniqueNegative?: number;
  FeedbackCount?: number;
};

type TradeMeListingDetail = TradeMeListing & {
  ShippingOptions?: TradeMeShippingOption[];
  Quantity?: number;
  QuantityRemaining?: number;
  AvailableToBuy?: number;
  MaximumBuyNowQuantity?: number;
  IsBuyNowOnly?: boolean;
  Photos?: TradeMePhoto[];
  Body?: string;
  Attributes?: { DisplayName?: string; Name?: string; DisplayValue?: string; Value?: string }[];
  ViewCount?: number;
  Member?: TradeMeMember;
};

type TradeMeSearchResponse = {
  TotalCount?: number;
  List?: TradeMeListing[];
};

type CacheEntry = { at: number; catalog: Catalog };

let cache: CacheEntry | null = null;

function tmHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Origin: "https://www.trademe.co.nz",
    Referer: "https://www.trademe.co.nz/a/search?member_listing=" + MEMBER_ID,
    "User-Agent": "LootersRetail/1.0",
  };
  const key = process.env.TRADEME_CONSUMER_KEY;
  const secret = process.env.TRADEME_CONSUMER_SECRET;
  if (key && secret) {
    headers.Authorization = [
      'OAuth oauth_consumer_key="' + key + '"',
      'oauth_signature_method="PLAINTEXT"',
      'oauth_signature="' + secret + '&"',
    ].join(", ");
  }
  return headers;
}

async function tmGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: tmHeaders(),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TradeMe ${res.status}: ${body.slice(0, 180)}`);
  }
  return (await res.json()) as T;
}

function upgradePhoto(url: string, size: "full" | "plus"): string {
  return url.replace(/\/photoserver\/[a-z]+\//i, `/photoserver/${size}/`);
}

function bestPhotos(detail: TradeMeListingDetail, fallback: TradeMeListing): string[] {
  const fromDetail = (detail.Photos ?? [])
    .map((p) => {
      const v = p.Value;
      return (
        v?.PlusSize ||
        v?.FullSize ||
        v?.Large ||
        v?.Gallery ||
        v?.Medium ||
        v?.List ||
        null
      );
    })
    .filter((u): u is string => Boolean(u))
    .map((u) => upgradePhoto(u, "plus"));
  if (fromDetail.length > 0) return fromDetail;
  const fallbacks = [
    ...(fallback.PhotoUrls ?? []),
    fallback.PictureHref,
  ].filter((u): u is string => Boolean(u));
  return fallbacks.map((u) => upgradePhoto(u, "full"));
}

function mapShipping(options: TradeMeShippingOption[] | undefined): ShippingOption[] {
  if (!options || options.length === 0) {
    return [{ id: "tbc", label: "Shipping arranged after purchase", price: 0 }];
  }
  return options.map((o, i) => {
    const price = typeof o.Price === "number" ? o.Price : 0;
    let label = o.Method?.trim() || "";
    const type = String(o.Type ?? "");
    if (!label) {
      switch (type) {
        case "Free":
        case "3":
          label = "Free shipping";
          break;
        case "Pickup":
        case "2":
          label = "Pickup";
          break;
        case "Custom":
        case "4":
          label = "Courier / post";
          break;
        default:
          label = "Shipping";
      }
    }
    return { id: String(o.ShippingId ?? o.Type ?? i), label, price };
  });
}

function shopCategory(path: string | null | undefined, fallback: string | null): string | null {
  const parts = (path ?? "").split("/").filter(Boolean);
  if (parts.length >= 2) return parts[1].replace(/-/g, " ");
  if (parts.length === 1) return parts[0].replace(/-/g, " ");
  return fallback;
}

function isComputersListing(listing: {
  Category?: string;
  CategoryPath?: string;
}): boolean {
  const number = listing.Category ?? "";
  if (number === COMPUTERS_CATEGORY || number.startsWith(`${COMPUTERS_CATEGORY}-`)) {
    return true;
  }
  const path = (listing.CategoryPath ?? "").toLowerCase().replace(/_/g, "-");
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed === "/computers" || trimmed.startsWith("/computers/");
}

function mapSeller(member: TradeMeMember | undefined): Seller | null {
  if (!member?.Nickname) return null;
  return {
    nickname: member.Nickname,
    region: member.Region ?? null,
    suburb: member.Suburb ?? null,
    positive: member.UniquePositive ?? 0,
    negative: member.UniqueNegative ?? 0,
    feedback: member.FeedbackCount ?? 0,
  };
}

async function fetchDetail(id: number): Promise<TradeMeListingDetail | null> {
  try {
    return await tmGet<TradeMeListingDetail>(`/Listings/${id}.json`);
  } catch {
    return null;
  }
}

function normalize(listing: TradeMeListing, detail: TradeMeListingDetail | null): Product {
  const merged: TradeMeListingDetail = { ...listing, ...(detail ?? {}) };
  const buyNow =
    (typeof merged.BuyNowPrice === "number" && merged.BuyNowPrice > 0) ||
    Boolean(merged.HasBuyNow);
  const amount = buyNow
    ? (merged.BuyNowPrice as number)
    : (merged.StartPrice ?? 0);
  const priceLabel =
    merged.PriceDisplay ??
    (amount > 0
      ? new Intl.NumberFormat("en-NZ", {
          style: "currency",
          currency: "NZD",
        }).format(amount)
      : "Price on request");

  const listedQty =
    (typeof merged.MaximumBuyNowQuantity === "number" && merged.MaximumBuyNowQuantity) ||
    (typeof merged.QuantityRemaining === "number" && merged.QuantityRemaining) ||
    (typeof merged.AvailableToBuy === "number" && merged.AvailableToBuy) ||
    (typeof merged.Quantity === "number" && merged.Quantity) ||
    1;
  const maxQty = buyNow ? Math.max(1, Math.min(99, listedQty)) : 1;
  const photos = bestPhotos(merged, listing);
  const catName = shopCategory(
    merged.CategoryPath ?? merged.Category,
    merged.CategoryName ?? categoryLabel(merged.CategoryPath ?? merged.Category ?? null),
  );

  return {
    id: String(listing.ListingId),
    title: merged.Title,
    categoryPath: merged.CategoryPath ?? merged.Category ?? null,
    categoryName: catName,
    priceLabel,
    amount,
    buyNow,
    photo: photos[0] ?? null,
    photos,
    region: merged.Region ?? null,
    suburb: merged.Suburb ?? null,
    listingUrl: `https://www.trademe.co.nz/a/marketplace/listing/${listing.ListingId}`,
    isNew: Boolean(merged.IsNew),
    shipping: mapShipping(merged.ShippingOptions),
    maxQty,
    description: merged.Body?.trim() || null,
    attributes: (merged.Attributes ?? [])
      .map((a) => ({
        name: a.DisplayName || a.Name || "",
        value: a.DisplayValue || a.Value || "",
      }))
      .filter((a) => a.name && a.value),
    viewCount: typeof merged.ViewCount === "number" ? merged.ViewCount : null,
  };
}

async function loadCatalogFresh(): Promise<Catalog> {
  const data = await tmGet<TradeMeSearchResponse>(
    `/Search/General.json?member_listing=${MEMBER_ID}&category=${COMPUTERS_CATEGORY}-&rows=50&sort_order=Default`,
  );
  const list = data.List ?? [];
  const products = list
    .filter((listing) => isComputersListing(listing))
    .map((listing) => normalize(listing, null));
  return { products, seller: null };
}

async function getCachedCatalog(): Promise<Catalog> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.catalog;
  const catalog = await loadCatalogFresh();
  cache = { at: Date.now(), catalog };
  return catalog;
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await getCachedCatalog();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[looters] catalog error:", message);
    return {
      products: [] as Product[],
      seller: null,
      error: "Unable to load products right now.",
    } satisfies Catalog;
  }
});

export const getProduct = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const id = String((input as { id?: unknown } | null)?.id ?? "");
    if (!/^\d+$/.test(id)) throw new Error("Invalid product id");
    return { id };
  })
  .handler(async ({ data }): Promise<Product | null> => {
    try {
      const catalog = await getCachedCatalog();
      const hit = catalog.products.find((p) => p.id === data.id);
      const detail = await fetchDetail(Number(data.id));
      if (!detail) return hit ?? null;
      const memberId = detail.Member?.MemberId ?? detail.MemberId;
      if (memberId && String(memberId) !== MEMBER_ID) return hit ?? null;
      if (!isComputersListing(detail)) return hit ?? null;
      const product = normalize(detail, detail);
      if (cache) {
        cache.catalog = {
          ...cache.catalog,
          products: cache.catalog.products.map((p) =>
            p.id === product.id ? product : p,
          ),
          seller: cache.catalog.seller ?? mapSeller(detail.Member),
        };
      }
      return product;
    } catch (error) {
      console.error("[looters] product error:", error);
      return null;
    }
  });
