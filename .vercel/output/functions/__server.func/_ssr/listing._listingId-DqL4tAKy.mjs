import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, t as AppShell } from "./app-shell-DA6wvLcJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing._listingId-DqL4tAKy.js
var import_jsx_runtime = require_jsx_runtime();
function ListingNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Listing not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "That item may have sold or been taken down."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to listings"
				})
			})
		]
	}) });
}
//#endregion
export { ListingNotFound as notFoundComponent };
