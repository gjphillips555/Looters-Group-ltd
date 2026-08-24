import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import {
  type Product,
  type SkuCode,
} from "@/data/catalog";

const SKU_CODES: SkuCode[] = [
  "DSKTP",
  "LPTOP",
  "CMPNT",
  "APARL",
  "SFTWR",
];

function skuFromBlob(blob: string): SkuCode | null {
  const upper = blob.toUpperCase();

  for (const code of SKU_CODES) {
    if (new RegExp(`\\b${code}\\b`).test(upper)) {
      return code;
    }
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
  if (typeof val === "number" && Number.isFinite(val)) {
    return val;
  }

  const n = parseFloat(
    String(val ?? "").replace(/[^0-9.]/g, "")
  );

  return Number.isFinite(n) ? n : 0;
}

function tradevineHeader(): string | null {
  const key = process.env.TRADEVINE_CONSUMER_KEY?.trim();
  const secret = process.env.TRADEVINE_CONSUMER_SECRET?.trim();
  const token = process.env.TRADEVINE_ACCESS_TOKEN?.trim();
  const tokenSecret =
    process.env.TRADEVINE_ACCESS_TOKEN_SECRET?.trim();

  if (!key || !secret || !token || !tokenSecret) {
    return null;
  }

  const sig =
    `${encodeURIComponent(secret)}&${encodeURIComponent(tokenSecret)}`;

  return (
    `OAuth oauth_consumer_key="${encodeURIComponent(key)}", ` +
    `oauth_token="${encodeURIComponent(token)}", ` +
    `oauth_signature_method="PLAINTEXT", ` +
    `oauth_signature="${sig}"`
  );
}

function labelsOf(it: Record<string, unknown>): string[] {
  const out: string[] = [];

  const add = (val: unknown) => {
    if (!val) return;

    if (typeof val === "string") {
      for (const part of val.split(/[;,|/]/)) {
        const t = part.trim();

        if (t) {
          out.push(t);
        }
      }

      return;
    }

    if (Array.isArray(val)) {
      val.forEach(add);
      return;
    }

    if (typeof val === "object") {
      const o = val as Record<string, unknown>;

      add(
        o.Name ??
          o.Label ??
          o.LabelName ??
          o.Value ??
          o.Code ??
          o.Tag
      );
    }
  };

  for (const key of [
    "Labels",
    "LabelList",
    "ProductLabels",
    "Tags",
    "Label",
    "ProductLabel",
  ]) {
    add(it[key]);
  }

  return out;
}

function photosOf(it: Record<string, unknown>): string[] {
  const urls: string[] = [];

  const add = (u: unknown) => {
    const s = String(u ?? "").trim();

    if (s.startsWith("http")) {
      urls.push(s.replace("http://", "https://"));
    }
  };

  for (const key of ["Photos", "PhotoList", "Images"]) {
    const raw = it[key];

    if (!Array.isArray(raw)) continue;

    for (const p of raw) {
      if (typeof p === "string") {
        add(p);
      } else if (p && typeof p === "object") {
        const o = p as Record<string, unknown>;

        add(
          o.PublicUrl ??
            o.Url ??
            o.PhotoUrl ??
            o.TradevineUrl
        );
      }
    }
  }

  add(it.PublicUrl ?? it.PictureHref ?? it.ImageUrl);

  return [...new Set(urls)];
}

function mapRule(
  it: Record<string, unknown>
): Product | null {
  const lid =
    it.LastTradeMeListingExternalID ??
    it.TradeMeListingRuleID ??
    it.ProductID;

  if (lid == null) {
    return null;
  }

  const id = String(lid);

  const title = String(
    it.Title ??
      it.RuleName ??
      it.ProductCode ??
      "Listing"
  ).trim();

  const code = String(it.ProductCode ?? "");

  const labs = labelsOf(it);

  /*
   * IMPORTANT:
   *
   * Category is determined from Tradevine data only.
   * We do NOT default unknown items into Computas.
   */
  const sku = skuFromBlob(
    [...labs, code, title].join(" ")
  );

  if (!sku) {
    return null;
  }

  const photos = photosOf(it);

  const price = money(
    it.BuyNowPrice ?? it.StartPrice
  );

  const desc = String(
    it.Description ??
      it.SubTitle ??
      ""
  )
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
    image:
      photos[0] ??
      "/brand/storefront.jpg",
    images:
      photos.length
        ? photos
        : undefined,
    sku,
    condition: "Trade Me · Tradevine",
    blurb:
      desc.slice(0, 280) ||
      title,
    specs:
      labs.length
        ? labs
        : [code].filter(Boolean),
  };
}

/*
 * Short cache only.
 *
 * Tradevine remains the source of truth.
 * Nothing from the local catalogue is merged
 * into the live Tradevine results.
 */
const cache: {
  at: number;
  items: Product[] | null;
} = {
  at: 0,
  items: null,
};

const CACHE_MS = 60 * 1000;

async function loadTradevine(): Promise<Product[]> {
  const auth = tradevineHeader();

  if (!auth) {
    throw new Error(
      "Tradevine credentials are not configured"
    );
  }

  if (
    cache.items &&
    Date.now() - cache.at < CACHE_MS
  ) {
    return cache.items;
  }

  const base = (
    process.env.TRADEVINE_BASE_URL ??
    "https://api.tradevine.com"
  ).replace(/\/$/, "");

  const items: Product[] = [];

  /*
   * Keep requesting pages until Tradevine tells us
   * that we have received the complete result set.
   *
   * This avoids the old hard limit of 5 pages.
   */
  for (let page = 1; ; page += 1) {
    const url =
      `${base}/v1/TradeMeListingRule` +
      `?pageNumber=${page}` +
      `&pageSize=100` +
      `&isArchived=false`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: auth,
        Connection: "close",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Tradevine request failed: ${res.status} ${res.statusText}`
      );
    }

    const data = (await res.json()) as {
      List?: Record<string, unknown>[];
      TotalCount?: number;
    };

    const rawBatch = data.List ?? [];

    /*
     * Map only valid/current Tradevine records.
     * Unknown/unclassified records are ignored rather
     * than incorrectly becoming Computas products.
     */
    const batch = rawBatch
      .map(mapRule)
      .filter(
        (p): p is Product =>
          Boolean(p)
      );

    items.push(...batch);

    const totalCount =
      Number(data.TotalCount ?? 0);

    /*
     * Stop when:
     * - Tradevine returned no records
     * - We have received the advertised total
     * - The page contained fewer than 100 records
     */
    if (
      rawBatch.length === 0 ||
      (totalCount > 0 &&
        items.length >= totalCount) ||
      rawBatch.length < 100
    ) {
      break;
    }
  }

  /*
   * Remove duplicate listing IDs.
   */
  const unique = new Map<string, Product>();

  for (const item of items) {
    unique.set(item.id, item);
  }

  const current = [...unique.values()];

  /*
   * Only cache a successful Tradevine result.
   *
   * This is important:
   * an API failure must NOT cause old inventory
   * to be presented as current inventory.
   */
  cache.at = Date.now();
  cache.items = current;

  return current;
}

export const getStoreListings =
  createServerFn({ method: "GET" })
    .validator(
      (branch: Product["branch"]) => branch
    )
    .handler(async ({ data: branch }) => {
      /*
       * Tradevine is the ONLY source of live listings.
       *
       * There is deliberately NO local catalogue fallback.
       */
      const live = await loadTradevine();

      /*
       * Strict store separation.
       */
      if (branch === "apparel") {
        return live.filter(
          (p) => p.sku === "APARL"
        );
      }

      if (branch === "computas") {
        return live.filter(
          (p) =>
            p.sku === "DSKTP" ||
            p.sku === "LPTOP" ||
            p.sku === "CMPNT"
        );
      }

      if (branch === "software") {
        return live.filter(
          (p) => p.sku === "SFTWR"
        );
      }

      return [];
    });

export const getListing =
  createServerFn({ method: "GET" })
    .validator(
      (id: string) => id.trim()
    )
    .handler(async ({ data: id }) => {
      /*
       * A listing is considered valid only if it
       * currently exists in Tradevine.
       */
      const live = await loadTradevine();

      return (
        live.find(
          (p) => p.id === id
        ) ?? null
      );
    });

export function useStoreListings(
  branch: Product["branch"],
  fallback: Product[]
) {
  /*
   * Keep the supplied fallback for the initial
   * render only. Once the server responds, the
   * Tradevine result becomes authoritative.
   */
  const [items, setItems] =
    useState(fallback);

  useEffect(() => {
    let live = true;

    void getStoreListings({
      data: branch,
    })
      .then((rows) => {
        if (!live) return;

        /*
         * IMPORTANT:
         *
         * An empty Tradevine result is valid.
         * Do NOT retain old fallback products.
         *
         * This is what allows a completely empty
         * store to correctly display as empty.
         */
        setItems(rows);
      })
      .catch(() => {
        /*
         * Do not replace current data with stale
         * local catalogue data after a Tradevine error.
         *
         * Keeping the previous UI state is safer than
         * pretending stale products are current.
         */
      });

    return () => {
      live = false;
    };
  }, [branch]);

  return items;
}

export function useListing(id: string) {
  const [product, setProduct] =
    useState<Product | null>(null);

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    let live = true;

    setReady(false);

    void getListing({
      data: id,
    })
      .then((row) => {
        if (!live) return;

        /*
         * If the item has been deleted from Tradevine,
         * row will be null.
         */
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

  return {
    product,
    ready,
  };
}
