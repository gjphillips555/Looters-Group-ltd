import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn } from "./app-shell-DA6wvLcJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-DkX3Cgyp.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Input as t };
