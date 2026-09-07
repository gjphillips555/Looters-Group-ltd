import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as preferredShippingId, i as nzd } from "./products-BaOLoc8T.mjs";
import { a as ShoppingCart, c as Plus, i as Trash2, l as Minus, n as Truck, o as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-DA6wvLcJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full rounded-xl bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/payment-methods.png",
					alt: "Accepted payment methods: Amex, Apple Pay, Diners Club, Discover, Google Pay, JCB, Mastercard, PayPal and Visa",
					className: "mx-auto h-auto w-full max-w-2xl"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: [
					"© 2026 LootersRetail. Prices in NZD, GST inclusive. Contact:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:LootersRetail@protonmail.com",
						className: "font-medium text-foreground underline-offset-2 hover:underline",
						children: "LootersRetail@protonmail.com"
					})
				]
			})]
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function QuantityStepper({ value, onChange, size = "md", max = 99 }) {
	const btn = size === "sm" ? "size-9" : "size-11";
	const atMax = value >= max;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center rounded-md border border-border bg-secondary/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Decrease quantity",
				onClick: () => onChange(value - 1),
				className: cn(btn, "grid place-items-center rounded-l-md text-foreground transition-colors hover:bg-secondary"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "number",
				inputMode: "numeric",
				"aria-label": "Quantity",
				min: 0,
				max,
				value,
				onChange: (e) => onChange(Number(e.target.value)),
				className: "w-10 bg-transparent text-center text-sm font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Increase quantity",
				onClick: () => onChange(value + 1),
				disabled: atMax,
				className: cn(btn, "grid place-items-center rounded-r-md text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,opacity,transform,box-shadow] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:enabled:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-transparent hover:bg-secondary hover:text-foreground",
			ghost: "hover:bg-secondary hover:text-foreground",
			destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25",
			accent: "bg-accent text-accent-foreground hover:bg-accent/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5 text-base",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function toCartProduct(product) {
	return {
		id: product.id,
		title: product.title,
		amount: product.amount,
		priceLabel: product.priceLabel,
		photo: product.photo,
		shipping: product.shipping,
		maxQty: product.maxQty,
		listingUrl: product.listingUrl
	};
}
function cartProductFrom(product) {
	return {
		id: product.id,
		title: product.title,
		amount: product.amount,
		priceLabel: product.priceLabel,
		photo: product.photo,
		shipping: product.shipping,
		maxQty: product.maxQty,
		listingUrl: product.listingUrl
	};
}
var useCart = create()(persist((set) => ({
	lines: [],
	add: (product) => set((prev) => {
		const cap = Math.max(1, product.maxQty);
		if (prev.lines.find((l) => l.id === product.id)) return { lines: prev.lines.map((l) => l.id === product.id ? {
			...l,
			qty: Math.min(cap, l.qty + 1)
		} : l) };
		const shippingId = product.shipping[0]?.id ?? "";
		return { lines: [...prev.lines, {
			...toCartProduct(product),
			qty: 1,
			shippingId
		}] };
	}),
	setQty: (id, qty) => set((prev) => {
		const line = prev.lines.find((l) => l.id === id);
		if (!line) return prev;
		const cap = Math.max(1, line.maxQty);
		const clamped = Math.max(0, Math.min(cap, Math.round(qty)));
		if (clamped === 0) return { lines: prev.lines.filter((l) => l.id !== id) };
		return { lines: prev.lines.map((l) => l.id === id ? {
			...l,
			qty: clamped
		} : l) };
	}),
	setShipping: (id, shippingId) => set((prev) => ({ lines: prev.lines.map((l) => l.id === id ? {
		...l,
		shippingId
	} : l) })),
	applyIsland: (island) => set((prev) => ({ lines: prev.lines.map((l) => {
		const nextId = preferredShippingId(l.shipping, island);
		return nextId ? {
			...l,
			shippingId: nextId
		} : l;
	}) })),
	remove: (id) => set((prev) => ({ lines: prev.lines.filter((l) => l.id !== id) })),
	clear: () => set({ lines: [] })
}), { name: "looters-cart" }));
function useCartTotals() {
	const lines = useCart((s) => s.lines);
	let itemCount = 0;
	let subtotal = 0;
	let shippingTotal = 0;
	for (const l of lines) {
		const ship = l.shipping.find((s) => s.id === l.shippingId);
		itemCount += l.qty;
		subtotal += l.qty * l.amount;
		shippingTotal += ship?.price ?? 0;
	}
	return {
		lines,
		itemCount,
		subtotal,
		shippingTotal,
		total: subtotal + shippingTotal
	};
}
function isInCart(id, lines) {
	return lines.some((l) => l.id === id);
}
function CartDrawer({ open, onClose }) {
	const { setQty, setShipping, remove, clear } = useCart();
	const { lines, itemCount, subtotal, shippingTotal, total } = useCartTotals();
	const gstPortion = total - total / 1.15;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": !open,
		onClick: onClose,
		className: `fixed inset-0 z-40 bg-background/70 transition-opacity duration-200 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		role: "dialog",
		"aria-label": "Shopping cart",
		"aria-modal": "true",
		className: `fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 font-display text-lg font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5 text-primary" }),
						"Your cart",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-normal text-muted-foreground",
							children: [
								"(",
								itemCount,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close cart",
					className: "grid size-11 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-5 py-4",
				children: lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mx-auto size-10 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Your cart is empty. Add some Buy Now finds."
						})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-5",
					children: lines.map((line) => {
						const selectedShip = line.shipping.find((s) => s.id === line.shippingId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-16 shrink-0 overflow-hidden rounded-md bg-secondary/40",
									children: line.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: line.photo,
										alt: "",
										className: "h-full w-full object-cover"
									}) : null
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 flex-1 flex-col gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "line-clamp-2 text-sm font-medium leading-snug",
											children: line.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [nzd(line.amount), " each"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityStepper, {
												size: "sm",
												value: line.qty,
												max: line.maxQty,
												onChange: (q) => setQty(line.id, q)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-semibold tabular-nums",
													children: nzd(line.amount * line.qty)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => remove(line.id),
													"aria-label": `Remove ${line.title}`,
													className: "grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
												})]
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border/70 bg-secondary/30 p-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: `ship-${line.id}`,
										className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-3.5" }), " Shipping"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: `ship-${line.id}`,
										value: line.shippingId,
										onChange: (e) => setShipping(line.id, e.target.value),
										className: "h-10 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary",
										children: line.shipping.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s.id,
											children: [
												s.label,
												" — ",
												s.price > 0 ? nzd(s.price) : "Free"
											]
										}, s.id))
									}),
									selectedShip && selectedShip.price > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1.5 text-right text-xs text-muted-foreground",
										children: [
											"+ ",
											nzd(selectedShip.price),
											" shipping"
										]
									})
								]
							})]
						}, line.id);
					})
				})
			}),
			lines.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "space-y-4 border-t border-border px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: nzd(subtotal)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: shippingTotal > 0 ? nzd(shippingTotal) : "Free"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "GST (15% incl.)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: nzd(gstPortion)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-t border-border pt-1.5 text-base font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums text-accent",
									children: nzd(total)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted-foreground",
						children: "Prices and shipping are pulled live from TradeMe and shown exactly as listed. Totals are calculated on your device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: clear,
							children: "Clear"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/checkout",
								onClick: onClose,
								children: ["Checkout · ", nzd(total)]
							})
						})]
					})
				]
			})
		]
	})] });
}
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { itemCount } = useCartTotals();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-3",
				"aria-label": "LootersRetail home",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/looters-logo.png",
					alt: "LootersRetail",
					className: "h-12 w-auto sm:h-14"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "LootersRetail — live TradeMe deals"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen(true),
				className: "relative inline-flex h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Cart"
					}),
					itemCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground",
						children: itemCount
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {
			open,
			onClose: () => setOpen(false)
		})]
	});
}
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { cn as a, useCartTotals as c, cartProductFrom as i, Button as n, isInCart as o, QuantityStepper as r, useCart as s, AppShell as t };
