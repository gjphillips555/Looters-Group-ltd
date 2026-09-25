const API_VERSION = "2026-02-27";

function baseUrl() {
  return process.env.AIRWALLEX_ENV === "demo"
    ? "https://api-demo.airwallex.com/api/v1"
    : "https://api.airwallex.com/api/v1";
}

export function airwallexConfigured() {
  return Boolean(process.env.AIRWALLEX_CLIENT_ID?.trim() && process.env.AIRWALLEX_API_KEY?.trim());
}

async function login() {
  const clientId = process.env.AIRWALLEX_CLIENT_ID?.trim();
  const apiKey = process.env.AIRWALLEX_API_KEY?.trim();
  if (!clientId || !apiKey) throw new Error("Airwallex is not connected yet");
  const res = await fetch(`${baseUrl()}/authentication/login`, {
    method: "POST",
    headers: {
      "x-client-id": clientId,
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Airwallex login failed");
  const body = (await res.json()) as { token?: string };
  if (!body.token) throw new Error("Airwallex login failed");
  return body.token;
}

export async function createPaymentLink(input: {
  orderId: string;
  amount: number;
  title: string;
}) {
  const amount = Math.round(input.amount * 100) / 100;
  if (!(amount > 0) || amount > 20000) throw new Error("Invalid amount");
  const token = await login();
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  const res = await fetch(`${baseUrl()}/pa/payment_links/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-version": API_VERSION,
    },
    body: JSON.stringify({
      amount,
      currency: "NZD",
      title: input.title.slice(0, 80),
      description: `Order ${input.orderId}. Posted from Wellington once the payment clears.`,
      reusable: false,
      expires_at: expires,
      reference: input.orderId,
      metadata: { order_id: input.orderId },
      collectable_shopper_info: {
        billing_address: false,
        message: false,
        phone_number: false,
        reference: false,
        shipping_address: false,
      },
    }),
  });
  if (!res.ok) throw new Error("Could not start the card payment");
  const body = (await res.json()) as { url?: string };
  if (!body.url || !body.url.startsWith("https://")) throw new Error("Could not start the card payment");
  return { url: body.url };
}
