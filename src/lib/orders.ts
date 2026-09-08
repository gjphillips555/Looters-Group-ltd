import type { CartLine } from "@/lib/cart-store";

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  city: string;
  region: string;
  notes: string;
};

export type PlacedOrder = {
  id: string;
  createdAt: string;
  customer: Customer;
  lines: CartLine[];
  subtotal: number;
  shippingTotal: number;
  total: number;
};

const KEY = "looters-orders";

function readAll(): PlacedOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlacedOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: PlacedOrder) {
  const all = [order, ...readAll()].slice(0, 20);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function getOrder(id: string): PlacedOrder | null {
  return readAll().find((o) => o.id === id) ?? null;
}

export function newOrderId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LR-${Date.now().toString(36).toUpperCase()}-${n}`;
}

export function orderMailto(order: PlacedOrder) {
  const { customer, lines, subtotal, shippingTotal, total } = order;
  const nzd = (n: number) =>
    new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(n);
  const itemLines = lines
    .map((l) => {
      const ship = l.shipping.find((s) => s.id === l.shippingId);
      return [
        `- ${l.title}`,
        `  Qty ${l.qty} × ${nzd(l.amount)} = ${nzd(l.qty * l.amount)}`,
        `  Shipping: ${ship?.label ?? "TBC"} (${ship && ship.price > 0 ? nzd(ship.price) : "Free"})`,
        `  Item: ${l.listingUrl}`,
      ].join("\n");
    })
    .join("\n\n");
  const body = [
    `New LootersRetail order ${order.id}`,
    ``,
    `Customer`,
    `${customer.name}`,
    `${customer.email}`,
    customer.phone,
    `${customer.address}`,
    `${customer.suburb}, ${customer.city}`,
    customer.region,
    customer.notes ? `Notes: ${customer.notes}` : "",
    ``,
    `Items`,
    itemLines,
    ``,
    `Items ${nzd(subtotal)}`,
    `Shipping ${nzd(shippingTotal)}`,
    `Total ${nzd(total)} GST incl.`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const subject = encodeURIComponent(`LootersRetail order ${order.id}`);
  return `mailto:LootersRetail@protonmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
}
