import type { Customer } from "@/lib/orders";

export const PAYPAL_BUSINESS = "gjphillips555@gmail.com";

export function paypalAmount(total: number) {
  return (Math.round(total * 100) / 100).toFixed(2);
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return { first: name.trim(), last: "Customer" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function paypalFields(opts: {
  orderId: string;
  amount: number;
  returnUrl: string;
  cancelUrl: string;
  itemName?: string;
  customer?: Customer;
}) {
  const { first, last } = splitName(opts.customer?.name ?? "Guest");
  const custom = [
    opts.orderId,
    opts.customer?.phone ?? "",
    opts.customer?.suburb ?? "",
  ]
    .join("|")
    .slice(0, 255);

  return {
    cmd: "_xclick",
    business: PAYPAL_BUSINESS,
    item_name: (opts.itemName ?? `LootersRetail order ${opts.orderId}`).slice(0, 127),
    amount: paypalAmount(opts.amount),
    currency_code: "NZD",
    invoice: opts.orderId,
    no_shipping: "1",
    no_note: "0",
    return: opts.returnUrl,
    cancel_return: opts.cancelUrl,
    rm: "2",
    charset: "utf-8",
    email: opts.customer?.email ?? "",
    first_name: first.slice(0, 32),
    last_name: last.slice(0, 32),
    address1: (opts.customer?.address ?? "").slice(0, 100),
    city: (opts.customer?.city ?? "").slice(0, 40),
    state: (opts.customer?.region ?? "").slice(0, 40),
    country: "NZ",
    night_phone_a: (opts.customer?.phone ?? "").slice(0, 20),
    custom,
  } as const;
}

export function submitPayPalCheckout(opts: {
  orderId: string;
  amount: number;
  returnUrl: string;
  cancelUrl: string;
  itemName?: string;
  customer?: Customer;
}) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.paypal.com/cgi-bin/webscr";
  form.acceptCharset = "UTF-8";
  for (const [name, value] of Object.entries(paypalFields(opts))) {
    if (value === "") continue;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
