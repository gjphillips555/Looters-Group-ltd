import { ShoppingCart } from "lucide-react";
import { useCartTotals } from "@/lib/cart-store";

export function CartButton({ onClick }: { onClick: () => void }) {
  const { itemCount } = useCartTotals();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
    >
      <ShoppingCart className="size-4" />
      <span className="hidden sm:inline">Cart</span>
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
          {itemCount}
        </span>
      )}
    </button>
  );
}
