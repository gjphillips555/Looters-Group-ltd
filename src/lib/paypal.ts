/**
 * PayPal REST Orders API v2 + webhook helpers.
 * Env:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_MODE = "sandbox" | "live" (default sandbox)
 *   PAYPAL_WEBHOOK_ID = webhook id from PayPal dashboard (required to verify)
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

export function paypalWebhookId(): string | null {
  return process.env.PAYPAL_WEBHOOK_ID?.trim() || null;
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

// —— Webhooks ————————————————————————————————————————————————

export type PayPalWebhookHeaders = {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
};

export type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  create_time?: string;
  resource_type?: string;
  summary?: string;
  resource?: Record<string, unknown>;
};

/** Verify transmission using PayPal's verify-webhook-signature API. */
export async function verifyPayPalWebhook(
  headers: PayPalWebhookHeaders,
  webhookEvent: unknown,
): Promise<boolean> {
  const webhookId = paypalWebhookId();
  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not set");
  }

  const token = await accessToken();
  const res = await fetch(`${baseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.authAlgo,
      cert_url: headers.certUrl,
      transmission_id: headers.transmissionId,
      transmission_sig: headers.transmissionSig,
      transmission_time: headers.transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("[paypal] verify-webhook failed", res.status, t.slice(0, 300));
    return false;
  }

  const data = (await res.json()) as { verification_status?: string };
  return data.verification_status === "SUCCESS";
}

export function readPayPalWebhookHeaders(request: Request): PayPalWebhookHeaders | null {
  const authAlgo = request.headers.get("paypal-auth-algo") ?? "";
  const certUrl = request.headers.get("paypal-cert-url") ?? "";
  const transmissionId = request.headers.get("paypal-transmission-id") ?? "";
  const transmissionSig = request.headers.get("paypal-transmission-sig") ?? "";
  const transmissionTime = request.headers.get("paypal-transmission-time") ?? "";
  if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
    return null;
  }
  return { authAlgo, certUrl, transmissionId, transmissionSig, transmissionTime };
}

/** Extract listing id / amount from common webhook resource shapes. */
export function summarizeWebhookEvent(event: PayPalWebhookEvent): {
  eventType: string;
  eventId: string;
  listingId?: string;
  orderId?: string;
  captureId?: string;
  amount?: string;
  currency?: string;
  status?: string;
  shipping?: string;
} {
  const eventType = String(event.event_type ?? "UNKNOWN");
  const eventId = String(event.id ?? "");
  const resource = event.resource ?? {};

  let listingId: string | undefined;
  let shipping: string | undefined;
  const custom =
    (resource.custom_id as string | undefined) ??
    (resource.custom as string | undefined) ??
    ((resource.purchase_units as { custom_id?: string }[] | undefined)?.[0]?.custom_id);

  if (typeof custom === "string" && custom) {
    try {
      const parsed = JSON.parse(custom) as { listingId?: string; shipping?: string };
      if (parsed.listingId) listingId = String(parsed.listingId);
      if (parsed.shipping) shipping = String(parsed.shipping);
    } catch {
      // custom_id may be plain listing id
      if (/^\d+$/.test(custom)) listingId = custom;
    }
  }

  // reference_id like tm-123456
  const ref =
    (resource.reference_id as string | undefined) ??
    ((resource.purchase_units as { reference_id?: string }[] | undefined)?.[0]?.reference_id);
  if (!listingId && typeof ref === "string" && ref.startsWith("tm-")) {
    listingId = ref.slice(3);
  }

  const amountObj =
    (resource.amount as { value?: string; currency_code?: string } | undefined) ??
    (
      resource.seller_receivable_breakdown as
        | { gross_amount?: { value?: string; currency_code?: string } }
        | undefined
    )?.gross_amount;

  const orderId =
    (resource.supplementary_data as { related_ids?: { order_id?: string } } | undefined)?.related_ids
      ?.order_id ??
    (resource.id && eventType.includes("ORDER") ? String(resource.id) : undefined);

  const captureId =
    eventType.includes("CAPTURE") && resource.id ? String(resource.id) : undefined;

  return {
    eventType,
    eventId,
    listingId,
    orderId: orderId ? String(orderId) : undefined,
    captureId,
    amount: amountObj?.value,
    currency: amountObj?.currency_code,
    status: resource.status ? String(resource.status) : undefined,
    shipping,
  };
}

/** Events we actively care about for sales ops. */
export const HANDLED_WEBHOOK_EVENTS = new Set([
  "CHECKOUT.ORDER.APPROVED",
  "CHECKOUT.ORDER.COMPLETED",
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.PENDING",
  "PAYMENT.CAPTURE.REFUNDED",
  "PAYMENT.CAPTURE.REVERSED",
]);
