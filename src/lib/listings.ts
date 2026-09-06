import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { type Product, type ShippingOption, type SkuCode } from "@/data/catalog";

const SKU_CODES: SkuCode[] = ["DSKTP", "LPTOP", "CMPNT", "APARL", "SFTWR"];

/** LootersComputas Trade Me member id */
const MEMBER_DEFAULT = "9233545";

function skuFromBlob(blob: string): SkuCode | null {
  const upper = blob.toUpperCase();
  for (const code of SKU_CODES) {
    if (new RegExp(`\\b${code}\\b`).test(upper)) return code;
  }
  if (/\bAPPAREL\b/.test(upper)) return "APARL";
  if (/\bLAPTOP|\bNOTEBOOK|\bPROBOOK|\bELITEBOOK|\bTHINKPAD\b/.test(upper)) return "LPTOP";
  if (/\bDESKTOP|\bPRODESK|\bOPTIPLEX|\bSFF\b|\bMINI PC\b/.test(upper)) return "DSKTP";
  if (/\bSOFTWARE\b|\bSIFTA\b|\bLICENSE\b/.test(upper)) return "SFTWR";
  if (
    /\bGPU\b|\bGRAPHICS\b|\bRAM\b|\bSSD\b|\bHDD\b|\bCOMPONENT|\bCARD\b|\bNVS\b|\bQUADRO\b|\bGEFORCE\b/.test(
      upper,
    )
  ) {
    return "CMPNT";
  }
  if (/\/CLOTHING|\/FASHION|\/APPAREL/.test(upper)) return "APARL";
  if (/\/LAPTOPS?\b/.test(upper)) return "LPTOP";
  if (/\/DESKTOPS?\b/.test(upper)) return "DSKTP";
  if (/\/COMPUTERS?\b/.test(upper)) return "CMPNT";
  return null;
}

function branchForSku(sku: SkuCode): Product["branch"] {
  if (sku === "APARL") return "apparel";
  if (sku === "SFTWR") return "software";
  return "computas";
}

function categoryForSku(sku: SkuCode): string {
  if (sku === "DSKTP") return "Desktops";
  if (sku === "LPTOP") return "Laptops";
  if (sku === "APARL") return "Apparel";
  if (sku === "SFTWR") return "Software";
  return "Components";
}

function money(val: unknown): number {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  const n = parseFloat(String(val ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function tradeMeAuth(): string | null {
  const key = process.env.TRADEME_CONSUMER_KEY?.trim();
  const secret = process.env.TRADEME_CONSUMER_SECRET?.trim();
  if (!key || !secret) return null;
  const token = process.env.TRADEME_ACCESS_TOKEN?.trim();
  const tokenSecret = process.env.TRADEME_ACCESS_TOKEN_SECRET?.trim();
  if (token && tokenSecret) {
    const sig = `${encodeURIComponent(secret)}&${encodeURIComponent(tokenSecret)}`;
    return (
      `OAuth oauth_consumer_key="${encodeURIComponent(key)}", ` +
      `oauth_token="${encodeURIComponent(token)}", ` +
      `oauth_signature_method="PLAINTEXT", ` +
      `oauth_signature="${sig}"`
    );
  }
  return (
    `OAuth oauth_consumer_key="${encodeURIComponent(key)}", ` +
    `oauth_signature_method="PLAINTEXT", ` +
    `oauth_signature="${encodeURIComponent(secret)}&"`
  );
}

function photosFromListing(it: Record<string, unknown>): string[] {
  const urls: string[] = [];
  const add = (u: unknown) => {
    const s = String(u ?? "").trim().replace("http://", "https://");
    if (s.startsWith("http")) urls.push(s);
  };
  add(it.PictureHref);
  const photos = it.Photos;
  if (Array.isArray(photos)) {
    for (const p of photos) {
      if (!p || typeof p !== "object") continue;
      const v = (p as { Value?: Record<string, string> }).Value ?? (p as Record<string, string>);
      add(v.FullSize ?? v.Large ?? v.Gallery ?? v.Medium ?? v.List ?? v.Thumbnail);
    }
  }
  return [...new Set(urls)];
}

/** Map Trade Me ShippingOptions → our ShippingOption[] */
function shippingFromListing(it: Record<string, unknown>): ShippingOption[] {
  const raw = it.ShippingOptions;
  if (!Array.isArray(raw) || raw.length === 0) return [];

  const out: ShippingOption[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const typeNum = Number(r.Type ?? r.ShippingType ?? 0);
    const price = money(r.Price);
    const method = String(r.Method ?? r.Name ?? "").trim();
    const id = r.ShippingId ?? r.Id ?? `${typeNum}-${method}-${price}`;

    // Trade Me types: Undecided=1, Pickup=2, Free=3, Custom=4, TradeMe=5
    let type: ShippingOption["type"] = "other";
    let label = method;
    if (typeNum === 3 || (typeNum === 0 && price === 0 && /free/i.test(method))) {
      type = "free";
      label = method || "Free shipping within NZ";
    } else if (typeNum === 2 || /pick\s*up|collection/i.test(method)) {
      type = "pickup";
      label = method || "Pickup";
    } else if (typeNum === 1 || /undecided|to be arranged|arrange/i.test(method)) {
      type = "undecided";
      label = method || "Shipping to be arranged";
    } else if (typeNum === 4 || typeNum === 5 || method) {
      type = "custom";
      label = method || (price > 0 ? "Courier" : "Shipping");
    } else {
      continue;
    }

    out.push({
      id: typeof id === "number" || typeof id === "string" ? id : String(id),
      label,
      price: type === "free" || type === "pickup" ? 0 : price,
      type,
    });
  }
  return out;
}

function mapListing(it: Record<string, unknown>): Product | null {
  const lid = it.ListingId;
  if (lid == null) return null;
  const id = String(lid);
  const title = String(it.Title ?? "Listing").trim();
  const skuCode = String(it.SKU ?? "");
  const path = String(it.CategoryPath ?? it.Category ?? "");
  const body = String(it.Body ?? it.Subtitle ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sku =
    skuFromBlob([skuCode, title, path, body].join(" ")) ??
    (path.includes("/Computers") || path.includes("/Electronics") ? ("CMPNT" as SkuCode) : null);
  if (!sku) return null;

  const photos = photosFromListing(it);
  const price = money(it.BuyNowPrice) || money(it.StartPrice) || money(it.PriceDisplay);
  const shippingOptions = shippingFromListing(it);

  return {
    id,
    listingId: id,
    branch: branchForSku(sku),
    title,
    price,
    category: categoryForSku(sku),
    image: photos[0] ?? "/brand/storefront.jpg",
    images: photos.length ? photos : undefined,
    sku,
    condition: "Trade Me",
    blurb: body.slice(0, 280) || title,
    // Customer-facing page: hide Trade Me SKU codes and category paths (e.g. /Computers/...)
    specs: [],
    shippingOptions: shippingOptions.length ? shippingOptions : undefined,
  };
}

const cache: { at: number; items: Product[] | null } = { at: 0, items: null };
const CACHE_MS = 60 * 1000;

async function loadTradeMe(): Promise<Product[]> {
  const auth = tradeMeAuth();
  if (!auth) throw new Error("Trade Me credentials are not configured");

  if (cache.items && Date.now() - cache.at < CACHE_MS) return cache.items;

  const memberId = (process.env.TRADEME_MEMBER_ID ?? MEMBER_DEFAULT).trim();
  const items: Product[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const url =
      `https://api.trademe.co.nz/v1/Search/General.json` +
      `?member_listing=${encodeURIComponent(memberId)}` +
      `&rows=50&page=${page}&photo_size=FullSize&sort_order=ExpiryDesc`;

    const res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: auth },
    });
    if (!res.ok) {
      throw new Error(`Trade Me search failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as {
      List?: Record<string, unknown>[];
      TotalCount?: number;
    };
    const batch = data.List ?? [];
    if (batch.length === 0) break;

    for (const row of batch) {
      const id = row.ListingId;
      if (id == null) continue;
      try {
        const detailRes = await fetch(`https://api.trademe.co.nz/v1/Listings/${id}.json`, {
          headers: { Accept: "application/json", Authorization: auth },
        });
        const detail = detailRes.ok
          ? ((await detailRes.json()) as Record<string, unknown>)
          : row;
        const mapped = mapListing({ ...row, ...detail });
        if (mapped) items.push(mapped);
      } catch {
        const mapped = mapListing(row);
        if (mapped) items.push(mapped);
      }
    }

    const total = Number(data.TotalCount ?? 0);
    if (batch.length < 50 || (total > 0 && items.length >= total)) break;
  }

  const unique = new Map<string, Product>();
  for (const item of items) unique.set(item.id, item);
  const current = [...unique.values()];
  cache.at = Date.now();
  cache.items = current;
  return current;
}

export const getStoreListings = createServerFn({ method: "GET" })
  .validator((branch: Product["branch"]) => branch)
  .handler(async ({ data: branch }) => {
    const live = await loadTradeMe();
    if (branch === "apparel") return live.filter((p) => p.sku === "APARL");
    if (branch === "computas") {
      return live.filter((p) => p.sku === "DSKTP" || p.sku === "LPTOP" || p.sku === "CMPNT");
    }
    if (branch === "software") return live.filter((p) => p.sku === "SFTWR");
    return [];
  });

export const getListing = createServerFn({ method: "GET" })
  .validator((id: string) => id.trim())
  .handler(async ({ data: id }) => {
    const live = await loadTradeMe();
    return live.find((p) => p.id === id) ?? null;
  });

export function useStoreListings(branch: Product["branch"], fallback: Product[]) {
  const [items, setItems] = useState(fallback);
  useEffect(() => {
    let live = true;
    void getStoreListings({ data: branch })
      .then((rows) => {
        if (!live) return;
        setItems(rows);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [branch]);
  return items;
}

export function useListing(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    setReady(false);
    void getListing({ data: id })
      .then((row) => {
        if (!live) return;
        setProduct(row);
        setReady(true);
      })
      .catch(() => {
        if (!live) return;
        setProduct(null);
        setReady(true);
      });
    return () => {
      live = false;
    };
  }, [id]);
  return { product, ready };
}
