//#region node_modules/.nitro/vite/services/ssr/assets/orders-BUXEJnHu.js
var KEY = "looters-orders";
function readAll() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function saveOrder(order) {
	const all = [order, ...readAll()].slice(0, 20);
	window.localStorage.setItem(KEY, JSON.stringify(all));
}
function getOrder(id) {
	return readAll().find((o) => o.id === id) ?? null;
}
function newOrderId() {
	const n = Math.floor(1e3 + Math.random() * 9e3);
	return `LR-${Date.now().toString(36).toUpperCase()}-${n}`;
}
function orderMailto(order) {
	const { customer, lines, subtotal, shippingTotal, total } = order;
	const nzd = (n) => new Intl.NumberFormat("en-NZ", {
		style: "currency",
		currency: "NZD"
	}).format(n);
	const itemLines = lines.map((l) => {
		const ship = l.shipping.find((s) => s.id === l.shippingId);
		return [
			`- ${l.title}`,
			`  Qty ${l.qty} × ${nzd(l.amount)} = ${nzd(l.qty * l.amount)}`,
			`  Shipping: ${ship?.label ?? "TBC"} (${ship && ship.price > 0 ? nzd(ship.price) : "Free"})`,
			`  TradeMe: ${l.listingUrl}`
		].join("\n");
	}).join("\n\n");
	const body = [
		`New LootersRetail order ${order.id}`,
		``,
		`Customer`,
		`${customer.name}`,
		`${customer.email}`,
		customer.phone,
		`${customer.address}`,
		`${customer.suburb}, ${customer.city}`,
		customer.region,
		customer.notes ? `Notes: ${customer.notes}` : "",
		``,
		`Items`,
		itemLines,
		``,
		`Items ${nzd(subtotal)}`,
		`Shipping ${nzd(shippingTotal)}`,
		`Total ${nzd(total)} GST incl.`
	].filter((line) => line !== "").join("\n");
	return `mailto:LootersRetail@protonmail.com?subject=${encodeURIComponent(`LootersRetail order ${order.id}`)}&body=${encodeURIComponent(body)}`;
}
//#endregion
export { saveOrder as i, newOrderId as n, orderMailto as r, getOrder as t };
