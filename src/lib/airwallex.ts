import { createServerFn } from "@tanstack/react-start";

export const airwallexReady = createServerFn({ method: "GET" }).handler(async () => {
  const { airwallexConfigured } = await import("@/lib/airwallex.server");
  return airwallexConfigured();
});

export const startCardPay = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const v = (input ?? {}) as { orderId?: unknown; amount?: unknown; title?: unknown };
    const orderId = String(v.orderId ?? "");
    const amount = Number(v.amount);
    const title = String(v.title ?? "Looters Computas").slice(0, 80);
    if (!/^LR-[A-Z0-9-]+$/.test(orderId)) throw new Error("Invalid order");
    if (!Number.isFinite(amount) || amount <= 0 || amount > 20000) throw new Error("Invalid amount");
    return { orderId, amount, title };
  })
  .handler(async ({ data }) => {
    const { createPaymentLink } = await import("@/lib/airwallex.server");
    return createPaymentLink(data);
  });
