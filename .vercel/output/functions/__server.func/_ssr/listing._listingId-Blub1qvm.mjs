import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as nzd } from "./products-BaOLoc8T.mjs";
import { a as ShoppingCart, f as ExternalLink, h as Check, n as Truck, u as MapPin } from "../_libs/lucide-react.mjs";
import { i as cartProductFrom, n as Button, o as isInCart, r as QuantityStepper, s as useCart, t as AppShell } from "./app-shell-DA6wvLcJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$1 } from "./router-hN-A8a3D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing._listingId-Blub1qvm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ListingPage() {
	const product = Route$1.useLoaderData();
	const add = useCart((s) => s.add);
	const setQty = useCart((s) => s.setQty);
	const lines = useCart((s) => s.lines);
	const line = lines.find((l) => l.id === product.id);
	const [photoIndex, setPhotoIndex] = (0, import_react.useState)(0);
	const [added, setAdded] = (0, import_react.useState)(false);
	const canBuy = product.buyNow && product.amount > 0;
	const inCart = isInCart(product.id, lines);
	const photos = product.photos.length > 0 ? product.photos : product.photo ? [product.photo] : [];
	const activePhoto = photos[photoIndex] ?? photos[0];
	function handleAdd() {
		if (!inCart) add(cartProductFrom(product));
		setAdded(true);
		toast.success("Added to cart", { description: product.title });
		window.setTimeout(() => setAdded(false), 1200);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-6 text-sm text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "hover:text-foreground",
					children: "Listings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-2",
					children: "/"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: product.categoryName ?? "Item"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-square bg-secondary/40",
					children: activePhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: activePhoto,
						alt: product.title,
						className: "h-full w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-muted-foreground",
						children: "No photo"
					})
				})
			}), photos.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2 overflow-x-auto",
				children: photos.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPhotoIndex(i),
					className: `size-16 shrink-0 overflow-hidden rounded-md border ${i === photoIndex ? "border-primary" : "border-border"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "",
						className: "h-full w-full object-cover"
					})
				}, src))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-5",
				children: [
					product.categoryName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: product.categoryName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight sm:text-3xl",
						children: product.title
					}),
					product.region && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1.5 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), [product.suburb, product.region].filter(Boolean).join(", ")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-bold text-accent",
						children: product.priceLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: product.buyNow ? product.maxQty <= 1 ? "Buy Now · 1 available · GST inclusive" : `Buy Now · up to ${product.maxQty} · GST inclusive` : "Auction on TradeMe"
					})] }),
					canBuy && product.shipping.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-secondary/30 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-3.5" }), " Shipping options"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: product.shipping.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium tabular-nums",
									children: s.price > 0 ? nzd(s.price) : "Free"
								})]
							}, s.id))
						})]
					}),
					product.attributes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "grid grid-cols-2 gap-3 rounded-xl border border-border p-4",
						children: product.attributes.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: a.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-sm font-medium",
							children: a.value
						})] }, a.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3 sm:flex-row",
						children: canBuy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							inCart && product.maxQty > 1 && line && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityStepper, {
								value: line.qty,
								max: product.maxQty,
								onChange: (q) => setQty(product.id, q)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								className: "flex-1",
								onClick: handleAdd,
								disabled: inCart && product.maxQty <= 1,
								children: [added || inCart && product.maxQty <= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, {}), inCart && product.maxQty <= 1 ? "In cart" : added ? "Added" : inCart ? "Add another" : "Add to cart"]
							}),
							inCart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/checkout",
									children: "Checkout"
								})
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: product.listingUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								children: ["View auction on TradeMe ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: product.listingUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
						children: ["Open original TradeMe listing ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					})
				]
			})]
		}),
		product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-lg font-semibold",
				children: "Description"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground",
				children: product.description
			})]
		})
	] });
}
//#endregion
export { ListingPage as component };
