import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as categoryLabel } from "./products-BaOLoc8T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BMREDhq2.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MEMBER_ID = "9233545";
var API_BASE = "https://api.trademe.co.nz/v1";
var CACHE_MS = 6e4;
var cache = null;
function tmHeaders() {
	const headers = {
		Accept: "application/json",
		Origin: "https://www.trademe.co.nz",
		Referer: "https://www.trademe.co.nz/a/search?member_listing=9233545",
		"User-Agent": "LootersRetail/1.0"
	};
	const key = process.env.TRADEME_CONSUMER_KEY;
	const secret = process.env.TRADEME_CONSUMER_SECRET;
	if (key && secret) headers.Authorization = [
		"OAuth oauth_consumer_key=\"" + key + "\"",
		"oauth_signature_method=\"PLAINTEXT\"",
		"oauth_signature=\"" + secret + "&\""
	].join(", ");
	return headers;
}
async function tmGet(path) {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: tmHeaders(),
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) {
		const body = await res.text().catch(() => "");
		throw new Error(`TradeMe ${res.status}: ${body.slice(0, 180)}`);
	}
	return await res.json();
}
function bestPhotos(detail, fallback) {
	const fromDetail = (detail.Photos ?? []).map((p) => {
		const v = p.Value;
		return v?.FullSize || v?.PlusSize || v?.Large || v?.Gallery || v?.Medium || v?.List || null;
	}).filter((u) => Boolean(u));
	if (fromDetail.length > 0) return fromDetail;
	return [...fallback.PhotoUrls ?? [], fallback.PictureHref].filter((u) => Boolean(u));
}
function mapShipping(options) {
	if (!options || options.length === 0) return [{
		id: "tbc",
		label: "Shipping arranged after purchase",
		price: 0
	}];
	return options.map((o, i) => {
		const price = typeof o.Price === "number" ? o.Price : 0;
		let label = o.Method?.trim() || "";
		const type = String(o.Type ?? "");
		if (!label) switch (type) {
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
			default: label = "Shipping";
		}
		return {
			id: String(o.ShippingId ?? o.Type ?? i),
			label,
			price
		};
	});
}
function mapSeller(member) {
	if (!member?.Nickname) return null;
	return {
		nickname: member.Nickname,
		region: member.Region ?? null,
		suburb: member.Suburb ?? null,
		positive: member.UniquePositive ?? 0,
		negative: member.UniqueNegative ?? 0,
		feedback: member.FeedbackCount ?? 0
	};
}
async function fetchDetail(id) {
	try {
		return await tmGet(`/Listings/${id}.json`);
	} catch {
		return null;
	}
}
function normalize(listing, detail) {
	const merged = {
		...listing,
		...detail ?? {}
	};
	const buyNow = typeof merged.BuyNowPrice === "number" && merged.BuyNowPrice > 0 || Boolean(merged.HasBuyNow);
	const amount = buyNow ? merged.BuyNowPrice : merged.StartPrice ?? 0;
	const priceLabel = merged.PriceDisplay ?? (amount > 0 ? new Intl.NumberFormat("en-NZ", {
		style: "currency",
		currency: "NZD"
	}).format(amount) : "Price on request");
	const listedQty = typeof merged.MaximumBuyNowQuantity === "number" && merged.MaximumBuyNowQuantity || typeof merged.QuantityRemaining === "number" && merged.QuantityRemaining || typeof merged.AvailableToBuy === "number" && merged.AvailableToBuy || typeof merged.Quantity === "number" && merged.Quantity || 1;
	const maxQty = buyNow ? Math.max(1, Math.min(99, listedQty)) : 1;
	const photos = bestPhotos(merged, listing);
	const catName = merged.CategoryName ?? categoryLabel(merged.CategoryPath ?? merged.Category ?? null);
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
		attributes: (merged.Attributes ?? []).map((a) => ({
			name: a.DisplayName || a.Name || "",
			value: a.DisplayValue || a.Value || ""
		})).filter((a) => a.name && a.value),
		viewCount: typeof merged.ViewCount === "number" ? merged.ViewCount : null
	};
}
async function loadCatalogFresh() {
	const list = (await tmGet(`/Search/General.json?member_listing=${MEMBER_ID}&rows=100&sort_order=Default`)).List ?? [];
	const details = await Promise.all(list.map((l) => fetchDetail(l.ListingId)));
	return {
		products: list.map((listing, i) => normalize(listing, details[i] ?? null)),
		seller: details.map((d) => mapSeller(d?.Member)).find(Boolean) ?? null
	};
}
async function getCachedCatalog() {
	if (cache && Date.now() - cache.at < CACHE_MS) return cache.catalog;
	const catalog = await loadCatalogFresh();
	cache = {
		at: Date.now(),
		catalog
	};
	return catalog;
}
var getCatalog_createServerFn_handler = createServerRpc({
	id: "0972d93ce719b68d87eb20b64083762d958ae8935306208d9729f45381e39a00",
	name: "getCatalog",
	filename: "src/lib/catalog.ts"
}, (opts) => getCatalog.__executeServer(opts));
var getCatalog = createServerFn({ method: "GET" }).handler(getCatalog_createServerFn_handler, async () => {
	try {
		return await getCachedCatalog();
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("[looters] catalog error:", message);
		return {
			products: [],
			seller: null,
			error: "Unable to load listings right now."
		};
	}
});
var getProduct_createServerFn_handler = createServerRpc({
	id: "bb7e7e2450555d24df3a04bab1583d6f54ed73c3a89806649a7ebbe96e61ca4b",
	name: "getProduct",
	filename: "src/lib/catalog.ts"
}, (opts) => getProduct.__executeServer(opts));
var getProduct = createServerFn({ method: "GET" }).validator((input) => {
	const id = String(input?.id ?? "");
	if (!/^\d+$/.test(id)) throw new Error("Invalid listing id");
	return { id };
}).handler(getProduct_createServerFn_handler, async ({ data }) => {
	try {
		const hit = (await getCachedCatalog()).products.find((p) => p.id === data.id);
		if (hit) return hit;
		const detail = await fetchDetail(Number(data.id));
		if (!detail) return null;
		const memberId = detail.Member?.MemberId ?? detail.MemberId;
		if (memberId && String(memberId) !== MEMBER_ID) return null;
		return normalize(detail, detail);
	} catch (error) {
		console.error("[looters] product error:", error);
		return null;
	}
});
//#endregion
export { getCatalog_createServerFn_handler, getProduct_createServerFn_handler };
