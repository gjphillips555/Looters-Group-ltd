import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ShippingOption } from "@/lib/products";
import { preferredShippingId, type Island } from "@/lib/products";

export type CartProduct = {
  id: string;
  title: string;
  amount: number;
  priceLabel: string;
  photo: string | null;
  shipping: ShippingOption[];
  maxQty: number;
  listingUrl: string;
};

export type CartLine = CartProduct & { qty: number; shippingId: string };

type CartState = {
  lines: CartLine[];
  add: (product: CartProduct) => void;
  setQty: (id: string, qty: number) => void;
  setShipping: (id: string, shippingId: string) => void;
  applyIsland: (island: Island) => void;
  remove: (id: string) => void;
  clear: () => void;
};

function toCartProduct(product: CartProduct): CartProduct {
  return {
    id: product.id,
    title: product.title,
    amount: product.amount,
    priceLabel: product.priceLabel,
    photo: product.photo,
    shipping: product.shipping,
    maxQty: product.maxQty,
    listingUrl: product.listingUrl,
  };
}

export function cartProductFrom(product: Product): CartProduct {
  return {
    id: product.id,
    title: product.title,
    amount: product.amount,
    priceLabel: product.priceLabel,
    photo: product.photo,
    shipping: product.shipping,
    maxQty: product.maxQty,
    listingUrl: product.listingUrl,
  };
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (product) =>
        set((prev) => {
          const cap = Math.max(1, product.maxQty);
          const existing = prev.lines.find((l) => l.id === product.id);
          if (existing) {
            return {
              lines: prev.lines.map((l) =>
                l.id === product.id ? { ...l, qty: Math.min(cap, l.qty + 1) } : l,
              ),
            };
          }
          const shippingId = product.shipping[0]?.id ?? "";
          return {
            lines: [
              ...prev.lines,
              { ...toCartProduct(product), qty: 1, shippingId },
            ],
          };
        }),
      setQty: (id, qty) =>
        set((prev) => {
          const line = prev.lines.find((l) => l.id === id);
          if (!line) return prev;
          const cap = Math.max(1, line.maxQty);
          const clamped = Math.max(0, Math.min(cap, Math.round(qty)));
          if (clamped === 0) {
            return { lines: prev.lines.filter((l) => l.id !== id) };
          }
          return {
            lines: prev.lines.map((l) => (l.id === id ? { ...l, qty: clamped } : l)),
          };
        }),
      setShipping: (id, shippingId) =>
        set((prev) => ({
          lines: prev.lines.map((l) => (l.id === id ? { ...l, shippingId } : l)),
        })),
      applyIsland: (island) =>
        set((prev) => ({
          lines: prev.lines.map((l) => {
            const nextId = preferredShippingId(l.shipping, island);
            return nextId ? { ...l, shippingId: nextId } : l;
          }),
        })),
      remove: (id) =>
        set((prev) => ({ lines: prev.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "looters-cart" },
  ),
);

export function useCartTotals() {
  const lines = useCart((s) => s.lines);
  let itemCount = 0;
  let subtotal = 0;
  let shippingTotal = 0;
  for (const l of lines) {
    const ship = l.shipping.find((s) => s.id === l.shippingId);
    itemCount += l.qty;
    subtotal += l.qty * l.amount;
    shippingTotal += ship?.price ?? 0;
  }
  return {
    lines,
    itemCount,
    subtotal,
    shippingTotal,
    total: subtotal + shippingTotal,
  };
}

export function isInCart(id: string, lines: CartLine[]) {
  return lines.some((l) => l.id === id);
}
