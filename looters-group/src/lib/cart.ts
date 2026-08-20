import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/catalog";

export type CartLine = {
  id: string;
  title: string;
  price: number;
  image: string;
  branch: Product["branch"];
  qty: number;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, qty = 1) => {
        const existing = get().lines.find((l) => l.id === product.id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.id === product.id ? { ...l, qty: l.qty + qty } : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              branch: product.branch,
              qty,
            },
          ],
        });
      },
      remove: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
      setQty: (id, qty) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.id !== id) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.id === id ? { ...l, qty } : l)),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "looters-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty * l.price, 0);
}
