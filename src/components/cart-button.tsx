import { ShoppingCart } from "lucide-react";
import { useCartTotals } from "@/lib/cart-store";

export function CartButton({ onClick }: { onClick: () => void }) {
  const { itemCount } = useCartTotals();

  return (
    <button
      type="button"
      onClick={onClick}
      className="kb-key kb-key-sm kb-white relative"
    >
      <span className="kb-cap">
        <ShoppingCart className="size-4" />
        <span className="hidden sm:inline">Cart</span>
      </span>
      {itemCount > 0 && (
        <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
          {itemCount}
        </span>
      )}
    </button>
  );
}
