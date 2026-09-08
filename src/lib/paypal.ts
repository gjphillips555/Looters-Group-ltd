export const PAYPAL_BUSINESS = "LootersRetail@protonmail.com";

export function paypalAmount(total: number) {
  return (Math.round(total * 100) / 100).toFixed(2);
}

export function paypalFields(opts: {
  orderId: string;
  amount: number;
  returnUrl: string;
  cancelUrl: string;
}) {
  return {
    cmd: "_xclick",
    business: PAYPAL_BUSINESS,
    item_name: `LootersRetail order ${opts.orderId}`,
    amount: paypalAmount(opts.amount),
    currency_code: "NZD",
    no_shipping: "1",
    no_note: "0",
    return: opts.returnUrl,
    cancel_return: opts.cancelUrl,
    rm: "2",
    charset: "utf-8",
  } as const;
}

export function submitPayPalCheckout(opts: {
  orderId: string;
  amount: number;
  returnUrl: string;
  cancelUrl: string;
}) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://www.paypal.com/cgi-bin/webscr";
  form.acceptCharset = "UTF-8";
  for (const [name, value] of Object.entries(paypalFields(opts))) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
