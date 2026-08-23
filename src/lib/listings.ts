import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  APPAREL_PRODUCTS,
  COMPUTAS_PRODUCTS,
  SOFTWARE_PRODUCTS,
  skuFor,
  type Product,
  type SkuCode,
} from "@/data/catalog";

const SKU_CODES: SkuCode[] = ["DSKTP", "LPTOP", "CMPNT", "APARL", "SFTWR"];

function skuFromBlob(blob: string): SkuCode | null {
  const upper = blob.toUpperCase();
  for (const code of SKU_CODES) {
    if (new RegExp(`\\b${code}\\b`).test(upper)) return code;
  }
  if (/\bAPPAREL\b/.test(upper)) return "APARL";
  if (/\bLAPTOP/.test(upper)) return "LPTOP";
  if (/\bDESKTOP/.test(upper)) return "DSKTP";
  if (/\bSOFTWARE\b/.test(upper)) return "SFTWR";
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

function tradevineHeader(): string | null {
  const key = process.env.TRADEVINE_CONSUMER_KEY?.trim();
  const secret = process.env.TRADEVINE_CONSUMER_SECRET?.trim();
  const token = process.env.TRADEVINE_ACCESS_TOKEN?.trim();
  const tokenSecret = process.env.TRADEVINE_ACCESS_TOKEN_SECRET?.trim();
  if (!key || !secret || !token || !tokenSecret) return null;
  const sig = `${encodeURIComponent(secret)}&${encodeURIComponent(tokenSecret)}`;
  return `OAuth oauth_consumer_key="${encodeURIComponent(key)}", oauth_token="${encodeURIComponent(token)}", oauth_signature_method="PLAINTEXT", oauth_signature="${sig}"`;
}

function labelsOf(it: Record<string, unknown>): string[] {
  const out: string[] = [];
  const add = (val: unknown) => {
    if (!val) return;
    if (typeof val === "string") {
      for (const part of val.split(/[;,|/]/)) {
        const t = part.trim();
        if (t) out.push(t);
      }
      return;
    }
    if (Array.isArray(val)) {
      val.forEach(add);
      return;
    }
    if (typeof val === "object") {
      const o = val as Record<string, unknown>;
      add(o.Name ?? o.Label ?? o.LabelName ?? o.Value ?? o.Code ?? o.Tag);
    }
  };
  for (const key of ["Labels", "LabelList", "ProductLabels", "Tags", "Label", "ProductLabel"]) {
    add(it[key]);
  }
  return out;
}

function photosOf(it: Record<string, unknown>): string[] {
  const urls: string[] = [];
  const add = (u: unknown) => {
    const s = String(u ?? "").trim();
    if (s.startsWith("http")) urls.push(s.replace("http://", "https://"));
  };
  for (const key of ["Photos", "PhotoList", "Images"]) {
    const raw = it[key];
    if (!Array.isArray(raw)) continue;
    for (const p of raw) {
      if (typeof p === "string") add(p);
      else if (p && typeof p === "object") {
        const o = p as Record<string, unknown>;
        add(o.PublicUrl ?? o.Url ?? o.PhotoUrl ?? o.TradevineUrl);
      }
    }
  }
  add(it.PublicUrl ?? it.PictureHref ?? it.ImageUrl);
  return [...new Set(urls)];
}

function mapRule(it: Record<string, unknown>): Product | null {
  const lid =
    it.LastTradeMeListingExternalID ?? it.TradeMeListingRuleID ?? it.ProductID;
  if (lid == null) return null;
  const id = String(lid);
  const title = String(it.Title ?? it.RuleName ?? it.ProductCode ?? "Listing").trim();
  const code = String(it.ProductCode ?? "");
  const labs = labelsOf(it);
  const sku = skuFromBlob([...labs, code, title].join(" ")) ?? "CMPNT";
  const photos = photosOf(it);
  const price = money(it.BuyNowPrice ?? it.StartPrice);
  const desc = String(it.Description ?? it.SubTitle ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    condition: "Trade Me · Tradevine",
    blurb: desc.slice(0, 280) || title,
    specs: labs.length ? labs : [code].filter(Boolean),
  };
}

const cache: { at: number; items: Product[] | null } = { at: 0, items: null };

async function loadTradevine(): Promise<Product[]> {
  const auth = tradevineHeader();
  if (!auth) return [];
  if (cache.items && Date.now() - cache.at < 5 * 60 * 1000) return cache.items;
  const base = (process.env.TRADEVINE_BASE_URL ?? "https://api.tradevine.com").replace(/\/$/, "");
  const items: Product[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const url = `${base}/v1/TradeMeListingRule?pageNumber=${page}&pageSize=100&isArchived=false`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: auth, Connection: "close" },
    });
    if (!res.ok) break;
    const data = (await res.json()) as { List?: Record<string, unknown>[]; TotalCount?: number };
    const batch = (data.List ?? []).map(mapRule).filter((p): p is Product => Boolean(p));
    items.push(...batch);
    if (!batch.length || items.length >= (data.TotalCount ?? batch.length)) break;
  }
  cache.at = Date.now();
  cache.items = items;
  return items;
}

function catalogFor(branch: Product["branch"]): Product[] {
  if (branch === "apparel") return APPAREL_PRODUCTS;
  if (branch === "software") return SOFTWARE_PRODUCTS;
  return COMPUTAS_PRODUCTS.filter((p) => skuFor(p) !== "APARL");
}

export const getStoreListings = createServerFn({ method: "GET" })
  .validator((branch: Product["branch"]) => branch)
  .handler(async ({ data: branch }) => {
    const live = await loadTradevine().catch(() => [] as Product[]);
    const fromTv = live.filter((p) => p.branch === branch);
    const local = catalogFor(branch);
    if (!fromTv.length) return local;
    const seen = new Set(fromTv.map((p) => p.id));
    const extras = local.filter((p) => !seen.has(p.id) && (branch !== "computas" || p.madeToOrder !== true));
    if (branch === "apparel") {
      const originals = local.filter((p) => p.madeToOrder);
      return [...fromTv, ...originals.filter((p) => !seen.has(p.id))];
    }
    return [...fromTv, ...extras];
  });

export const getListing = createServerFn({ method: "GET" })
  .validator((id: string) => id.trim())
  .handler(async ({ data: id }) => {
    const live = await loadTradevine().catch(() => [] as Product[]);
    const hit = live.find((p) => p.id === id);
    if (hit) return hit;
    const local = [...COMPUTAS_PRODUCTS, ...APPAREL_PRODUCTS, ...SOFTWARE_PRODUCTS];
    return local.find((p) => p.id === id) ?? null;
  });

export function useStoreListings(branch: Product["branch"], fallback: Product[]) {
  const [items, setItems] = useState(fallback);
  useEffect(() => {
    let live = true;
    void getStoreListings({ data: branch })
      .then((rows) => {
        if (live && rows.length) setItems(rows);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [branch]);
  return items;
}

export function useListing(id: string) {
  const [product, setProduct] = useState<Product | null>(() => {
    const local = [...COMPUTAS_PRODUCTS, ...APPAREL_PRODUCTS, ...SOFTWARE_PRODUCTS];
    return local.find((p) => p.id === id) ?? null;
  });
  const [ready, setReady] = useState(() => product !== null);
  useEffect(() => {
    let live = true;
    void getListing({ data: id }).then((row) => {
      if (!live) return;
      if (row) setProduct(row);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [id]);
  return { product, ready };
}

