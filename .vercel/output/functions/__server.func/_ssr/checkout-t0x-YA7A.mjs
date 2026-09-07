import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as nzd, r as islandForRegion, t as NZ_REGIONS } from "./products-BaOLoc8T.mjs";
import { a as cn, c as useCartTotals, n as Button, s as useCart, t as AppShell } from "./app-shell-DA6wvLcJ.mjs";
import { t as Input } from "./input-DkX3Cgyp.mjs";
import { i as saveOrder, n as newOrderId } from "./orders-BUXEJnHu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-t0x-YA7A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium leading-none text-foreground peer-disabled:opacity-50", className),
		...props
	});
}
var emptyCustomer = {
	name: "",
	email: "",
	phone: "",
	address: "",
	suburb: "",
	city: "",
	region: "Wellington",
	notes: ""
};
function CheckoutPage() {
	const navigate = useNavigate();
	const { lines, subtotal, shippingTotal, total, itemCount } = useCartTotals();
	const applyIsland = useCart((s) => s.applyIsland);
	const clear = useCart((s) => s.clear);
	const [customer, setCustomer] = (0, import_react.useState)(emptyCustomer);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const gstPortion = total - total / 1.15;
	function update(key, value) {
		setCustomer((prev) => {
			const next = {
				...prev,
				[key]: value
			};
			if (key === "region") applyIsland(islandForRegion(String(value)));
			return next;
		});
	}
	const canSubmit = (0, import_react.useMemo)(() => {
		return lines.length > 0 && customer.name.trim().length > 1 && /.+@.+\..+/.test(customer.email) && customer.phone.trim().length >= 7 && customer.address.trim().length > 2 && customer.city.trim().length > 1 && customer.region.trim().length > 1;
	}, [lines.length, customer]);
	function onSubmit(e) {
		e.preventDefault();
		if (!canSubmit) {
			setError("Please complete your contact and delivery details.");
			return;
		}
		setSubmitting(true);
		const order = {
			id: newOrderId(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			customer,
			lines,
			subtotal,
			shippingTotal,
			total
		};
		saveOrder(order);
		clear();
		navigate({
			to: "/order/$orderId",
			params: { orderId: order.id }
		});
	}
	if (lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Add a Buy Now listing before checking out."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Browse listings"
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-6 font-display text-3xl font-semibold tracking-tight",
		children: "Checkout"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Your details"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Full name",
					htmlFor: "name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						autoComplete: "name",
						required: true,
						value: customer.name,
						onChange: (e) => update("name", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						htmlFor: "email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							autoComplete: "email",
							required: true,
							value: customer.email,
							onChange: (e) => update("email", e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						htmlFor: "phone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							type: "tel",
							autoComplete: "tel",
							required: true,
							value: customer.phone,
							onChange: (e) => update("phone", e.target.value)
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Street address",
					htmlFor: "address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "address",
						autoComplete: "street-address",
						required: true,
						value: customer.address,
						onChange: (e) => update("address", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Suburb",
							htmlFor: "suburb",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "suburb",
								autoComplete: "address-level3",
								value: customer.suburb,
								onChange: (e) => update("suburb", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							htmlFor: "city",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "city",
								autoComplete: "address-level2",
								required: true,
								value: customer.city,
								onChange: (e) => update("city", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Region",
							htmlFor: "region",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "region",
								value: customer.region,
								onChange: (e) => update("region", e.target.value),
								className: "flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
								children: NZ_REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: r
								}, r))
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Order notes (optional)",
					htmlFor: "notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "notes",
						rows: 3,
						value: customer.notes,
						onChange: (e) => update("notes", e.target.value),
						className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
						placeholder: "Pickup window, courier instructions…"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted-foreground",
					children: "Shipping is matched to your island from the TradeMe listing. After you place the order you can email it to us, or pay each item on TradeMe with Ping or Afterpay."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-lg font-semibold",
					children: ["Order summary", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 text-sm font-normal text-muted-foreground",
						children: [
							"(",
							itemCount,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: lines.map((line) => {
						const ship = line.shipping.find((s) => s.id === line.shippingId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-14 shrink-0 overflow-hidden rounded-md bg-secondary/40",
								children: line.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: line.photo,
									alt: "",
									className: "h-full w-full object-cover"
								}) : null
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line-clamp-2 text-sm font-medium",
										children: line.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Qty ",
											line.qty,
											" · ",
											nzd(line.amount * line.qty)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											ship?.label ?? "Shipping TBC",
											" ·",
											" ",
											ship && ship.price > 0 ? nzd(ship.price) : "Free"
										]
									})
								]
							})]
						}, line.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-1.5 border-t border-border pt-3 text-sm",
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
							className: "flex justify-between pt-1 text-base font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums text-accent",
								children: nzd(total)
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "w-full",
					disabled: !canSubmit || submitting,
					children: ["Place order · ", nzd(total)]
				})
			]
		})]
	})] });
}
function Field({ label, htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor,
			children: label
		}), children]
	});
}
//#endregion
export { CheckoutPage as component };
