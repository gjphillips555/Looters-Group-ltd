import { LOGO_GROUPLTD } from "./store-logo-groupLtd";
import { LOGO_APPAREL } from "./store-logo-apparel";
import { LOGO_COMPUTAS } from "./store-logo-computas";
import { LOGO_SOFTWARE } from "./store-logo-software";

export { LOGO_GROUPLTD, LOGO_APPAREL, LOGO_COMPUTAS, LOGO_SOFTWARE };

export const STORE_LOGOS = [LOGO_GROUPLTD, LOGO_APPAREL, LOGO_COMPUTAS, LOGO_SOFTWARE] as const;
export type StoreLogo = (typeof STORE_LOGOS)[number];
export const GROUP_LOGO_SRC = LOGO_GROUPLTD.src;
