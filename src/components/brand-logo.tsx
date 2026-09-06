import type { BranchId } from "@/data/catalog";
import { LOGO_APPAREL } from "@/lib/store-logo-apparel";
import { LOGO_COMPUTAS } from "@/lib/store-logo-computas";
import { LOGO_SOFTWARE } from "@/lib/store-logo-software";

/** Branch logos used by BranchNav / BranchMenu — always local (data URL or /brand path). */
export const BRANCH_LOGO: Record<BranchId, string> = {
  computas: LOGO_COMPUTAS.src,
  apparel: LOGO_APPAREL.src,
  software: LOGO_SOFTWARE.src,
};
