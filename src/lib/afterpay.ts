import { nzd } from "@/lib/products";

/** Afterpay NZ: four equal interest-free instalments. */
export function afterpayEach(amount: number) {
  if (!(amount > 0)) return 0;
  return Math.round((amount / 4) * 100) / 100;
}

export function afterpayLabel(amount: number) {
  const each = afterpayEach(amount);
  if (each <= 0) return "";
  return `Pay 4 instalments of ${nzd(each)}`;
}
