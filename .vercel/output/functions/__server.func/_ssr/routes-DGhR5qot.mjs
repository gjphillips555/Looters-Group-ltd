import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as nzd } from "./products-BaOLoc8T.mjs";
import { a as ShoppingCart, f as ExternalLink, h as Check, m as CircleAlert, n as Truck, s as Search, u as MapPin } from "../_libs/lucide-react.mjs";
import { a as cn, i as cartProductFrom, n as Button, o as isInCart, s as useCart, t as AppShell } from "./app-shell-DA6wvLcJ.mjs";
import { t as Input } from "./input-DkX3Cgyp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$3 } from "./router-hN-A8a3D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DGhR5qot.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const add = useCart((s) => s.add);
	const lines = useCart((s) => s.lines);
	const [added, setAdded] = (0, import_react.useState)(false);
	const canBuy = product.buyNow && product.amount > 0;
	const inCart = isInCart(product.id, lines);
	const singleOnly = product.maxQty <= 1;
	const alreadyMaxed = inCart && singleOnly;
	function handleAdd(e) {
		e.preventDefault();
		e.stopPropagation();
		add(cartProductFrom(product));
		setAdded(true);
		toast.success("Added to cart", { description: product.title });
		window.setTimeout(() => setAdded(false), 1200);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/listing/$listingId",
			params: { listingId: product.id },
			className: "relative aspect-square overflow-hidden bg-secondary/40",
			children: [product.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.photo,
				alt: product.title,
				className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
				loading: "lazy"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-full place-items-center text-sm text-muted-foreground",
				children: "No photo"
			}), product.isNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground",
				children: "New"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [
				product.categoryName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs uppercase tracking-wide text-muted-foreground",
					children: product.categoryName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/listing/$listingId",
					params: { listingId: product.id },
					className: "line-clamp-2 text-pretty text-sm font-medium leading-snug hover:text-primary",
					children: product.title
				}),
				product.region && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
						" ",
						product.suburb ? `${product.suburb}, ` : "",
						product.region
					]
				}),
				canBuy && product.shipping.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border/70 bg-secondary/30 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-3.5" }), " Shipping options"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: product.shipping.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-medium tabular-nums text-foreground",
								children: s.price > 0 ? nzd(s.price) : "Free"
							})]
						}, s.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-bold text-accent",
						children: product.priceLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: product.buyNow ? singleOnly ? "Buy Now · 1 available" : `Buy Now · up to ${product.maxQty}` : "Auction"
					})] }), canBuy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						onClick: handleAdd,
						disabled: alreadyMaxed,
						children: [added || alreadyMaxed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-4" }), alreadyMaxed ? "In cart" : added ? "Added" : "Add"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: product.listingUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							children: ["View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
						})
					})]
				})
			]
		})]
	});
}
function ProductGrid({ products, error }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const categories = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const p of products) if (p.categoryName) set.add(p.categoryName);
		return Array.from(set).sort();
	}, [products]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return products.filter((p) => {
			if (category !== "all" && p.categoryName !== category) return false;
			if (!q) return true;
			return p.title.toLowerCase().includes(q) || (p.categoryName ?? "").toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
		});
	}, [
		products,
		query,
		category
	]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-md flex-col items-center gap-2 py-24 text-center text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-8 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium text-foreground",
				children: "Couldn't load listings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "The TradeMe catalog is temporarily unavailable. Please try again shortly."
			})
		]
	});
	if (products.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-24 text-center text-muted-foreground",
		children: "No live listings right now — check back soon."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search listings",
					className: "pl-9",
					"aria-label": "Search listings"
				})]
			}), categories.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: category === "all",
					onClick: () => setCategory("all"),
					children: "All"
				}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: category === c,
					onClick: () => setCategory(c),
					children: c
				}, c))]
			})]
		}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-16 text-center text-sm text-muted-foreground",
			children: "No listings match that search."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
			children: filtered.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
		})]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"),
		children
	});
}
function Home() {
	const catalog = Route$3.useLoaderData();
	const seller = catalog.seller;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary",
					children: "Live from TradeMe"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl",
					children: "Loot the best deals, straight from our TradeMe store"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base",
					children: "Every item below is pulled live from the LootersRetail TradeMe listings. Add Buy Now finds to your cart, adjust quantities, and we'll tally your total in NZD — all without touching a thing on TradeMe."
				}),
				seller && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Seller",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: seller.nickname
						}),
						seller.suburb || seller.region ? ` · ${[seller.suburb, seller.region].filter(Boolean).join(", ")}` : "",
						seller.positive > 0 ? ` · ${seller.positive} positive feedback` : ""
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: "Current listings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [catalog.products.length, " live"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
			products: catalog.products,
			error: catalog.error
		})
	] });
}
//#endregion
export { Home as component };
