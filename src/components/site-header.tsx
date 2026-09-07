import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import { useCartTotals } from "@/lib/cart-store";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCartTotals();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="LootersRetail home"
        >
          <img
            src="/looters-logo.png"
            alt="LootersRetail"
            className="h-12 w-auto sm:h-14"
          />
          <span className="sr-only">LootersRetail — live TradeMe deals</span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <ShoppingCart className="size-4" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
