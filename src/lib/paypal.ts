/**
 * PayPal REST Orders API v2 helpers.
 * Env:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_MODE = "sandbox" | "live" (default sandbox)
 */

export type PayPalMode = "sandbox" | "live";

function mode(): PayPalMode {
  const m = (process.env.PAYPAL_MODE ?? "sandbox").trim().toLowerCase();
  return m === "live" ? "live" : "sandbox";
}

function baseUrl(): string {
  return mode() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function paypalConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID?.trim() && process.env.PAYPAL_CLIENT_SECRET?.trim(),
  );
}

export function paypalClientId(): string | null {
  return process.env.PAYPAL_CLIENT_ID?.trim() || null;
}

let cachedToken: { value: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!id || !secret) throw new Error("PayPal is not configured");

  if (cachedToken && Date.now() < cachedToken.exp - 30_000) {
    return cachedToken.value;
  }

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal auth failed: ${res.status} ${t.slice(0, 200)}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    exp: Date.now() + (data.expires_in ?? 300) * 1000,
  };
  return data.access_token;
}

export type CreateOrderInput = {
  listingId: string;
  title: string;
  itemPrice: number;
  shippingPrice: number;
  shippingLabel: string;
  returnUrl: string;
  cancelUrl: string;
};

export async function createPayPalOrder(input: CreateOrderInput): Promise<{
  id: string;
  approveUrl: string;
}> {
  const token = await accessToken();
  const item = Math.max(0, Number(input.itemPrice.toFixed(2)));
  const ship = Math.max(0, Number(input.shippingPrice.toFixed(2)));
  const total = Number((item + ship).toFixed(2));

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: `tm-${input.listingId}`,
        description: input.title.slice(0, 120),
        custom_id: JSON.stringify({
          listingId: input.listingId,
          shipping: input.shippingLabel.slice(0, 80),
        }).slice(0, 127),
        amount: {
          currency_code: "NZD",
          value: total.toFixed(2),
          breakdown: {
            item_total: { currency_code: "NZD", value: item.toFixed(2) },
            shipping: { currency_code: "NZD", value: ship.toFixed(2) },
          },
        },
        items: [
          {
            name: input.title.slice(0, 127),
            quantity: "1",
            unit_amount: { currency_code: "NZD", value: item.toFixed(2) },
            description: `Trade Me #${input.listingId}`.slice(0, 127),
            category: "PHYSICAL_GOODS",
          },
        ],
      },
    ],
    application_context: {
      brand_name: "Looters Computas",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      shipping_preference: "GET_FROM_FILE",
      return_url: input.returnUrl,
      cancel_url: input.cancelUrl,
    },
  };

  const res = await fetch(`${baseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${t.slice(0, 300)}`);
  }

  const order = (await res.json()) as {
    id: string;
    links?: { rel: string; href: string }[];
  };
  const approve = order.links?.find((l) => l.rel === "approve")?.href;
  if (!approve) throw new Error("PayPal did not return an approve URL");
  return { id: order.id, approveUrl: approve };
}

export async function capturePayPalOrder(orderId: string): Promise<{
  id: string;
  status: string;
  captureId?: string;
  amount?: string;
  customId?: string;
}> {
  const token = await accessToken();
  const res = await fetch(`${baseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${t.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    id: string;
    status: string;
    purchase_units?: {
      custom_id?: string;
      payments?: {
        captures?: { id: string; amount?: { value: string } }[];
      };
    }[];
  };
  const unit = data.purchase_units?.[0];
  const cap = unit?.payments?.captures?.[0];
  return {
    id: data.id,
    status: data.status,
    captureId: cap?.id,
    amount: cap?.amount?.value,
    customId: unit?.custom_id,
  };
}
