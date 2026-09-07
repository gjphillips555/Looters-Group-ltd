import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as nzd } from "./products-BaOLoc8T.mjs";
import { d as Mail, f as ExternalLink, p as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./app-shell-DA6wvLcJ.mjs";
import { r as orderMailto, t as getOrder } from "./orders-BUXEJnHu.mjs";
import { n as Route } from "./router-hN-A8a3D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._orderId-4FwEQBlZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const { orderId } = Route.useParams();
	const [order, setOrder] = (0, import_react.useState)(void 0);
	(0, import_react.useEffect)(() => {
		setOrder(getOrder(orderId) ?? null);
	}, [orderId]);
	if (order === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-24 text-center text-sm text-muted-foreground",
		children: "Loading order…"
	}) });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Order not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "This confirmation is stored on this device only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to shop"
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-10 text-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight",
					children: "Order placed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Reference ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: order.id
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: "Email this order to LootersRetail so we can confirm stock and payment, or complete each Buy Now on TradeMe with Ping or Afterpay."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: orderMailto(order),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {}), " Email order to LootersRetail"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Keep shopping"
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-display text-lg font-semibold",
					children: "Items"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-4",
					children: order.lines.map((line) => {
						const ship = line.shipping.find((s) => s.id === line.shippingId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-16 shrink-0 overflow-hidden rounded-md bg-secondary/40",
								children: line.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: line.photo,
									alt: "",
									className: "h-full w-full object-cover"
								}) : null
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: line.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Qty ",
											line.qty,
											" · ",
											nzd(line.amount * line.qty),
											" ·",
											" ",
											ship?.label ?? "Shipping",
											" ",
											ship && ship.price > 0 ? nzd(ship.price) : "Free"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: line.listingUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline",
										children: ["Pay on TradeMe ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
									})
								]
							})]
						}, line.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 space-y-1.5 border-t border-border pt-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: nzd(order.subtotal)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: order.shippingTotal > 0 ? nzd(order.shippingTotal) : "Free"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums text-accent",
								children: nzd(order.total)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-lg bg-secondary/40 p-3 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: "Deliver to"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							order.customer.name,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							order.customer.address,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							[
								order.customer.suburb,
								order.customer.city,
								order.customer.region
							].filter(Boolean).join(", ")
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								order.customer.email,
								" · ",
								order.customer.phone
							]
						})
					]
				})
			]
		})]
	}) });
}
//#endregion
export { OrderPage as component };
