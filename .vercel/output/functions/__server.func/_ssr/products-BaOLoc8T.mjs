//#region node_modules/.nitro/vite/services/ssr/assets/products-BaOLoc8T.js
var nzd = (amount) => new Intl.NumberFormat("en-NZ", {
	style: "currency",
	currency: "NZD"
}).format(amount);
var NORTH_ISLAND = [
	"Northland",
	"Auckland",
	"Waikato",
	"Bay of Plenty",
	"Gisborne",
	"Hawke's Bay",
	"Taranaki",
	"Manawatū-Whanganui",
	"Manawatu-Whanganui",
	"Wellington"
];
var SOUTH_ISLAND = [
	"Tasman",
	"Nelson",
	"Marlborough",
	"West Coast",
	"Canterbury",
	"Otago",
	"Southland"
];
var NZ_REGIONS = [...NORTH_ISLAND, ...SOUTH_ISLAND];
function islandForRegion(region) {
	if (NORTH_ISLAND.includes(region)) return "north";
	if (SOUTH_ISLAND.includes(region)) return "south";
	return "unknown";
}
function preferredShippingId(shipping, island) {
	if (shipping.length === 0) return void 0;
	if (island === "north") {
		const match = shipping.find((s) => /north island/i.test(s.label));
		if (match) return match.id;
	}
	if (island === "south") {
		const match = shipping.find((s) => /south island/i.test(s.label));
		if (match) return match.id;
	}
	return (shipping.find((s) => !/pick-?up/i.test(s.label)) ?? shipping[0]).id;
}
function categoryLabel(path) {
	if (!path) return null;
	const last = path.split("/").filter(Boolean).slice(-1)[0];
	return last ? last.replace(/-/g, " ") : null;
}
//#endregion
export { preferredShippingId as a, nzd as i, categoryLabel as n, islandForRegion as r, NZ_REGIONS as t };
