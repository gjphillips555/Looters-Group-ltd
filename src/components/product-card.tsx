import { useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/catalog";
import { cartProductFrom, isInCart, useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const lines = useCart((s) => s.lines);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const canBuy = product.buyNow && product.amount > 0;
  const inCart = isInCart(product.id, lines);
  const singleOnly = product.maxQty <= 1;
  const alreadyMaxed = inCart && singleOnly;

  async function handleAdd(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (adding || alreadyMaxed) return;
    setAdding(true);
    try {
      const full = await getProduct({ data: { id: product.id } });
      add(cartProductFrom(full ?? product));
      setAdded(true);
      toast.success("Added to cart", {
        description: "Pick shipping in your cart to tally PayPal.",
      });
      window.setTimeout(() => setAdded(false), 1200);
    } catch {
      add(cartProductFrom(product));
      toast.success("Added to cart");
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className={cn("group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50", className)}>
      <Link
        to="/listing/$listingId"
        params={{ listingId: product.id }}
        className="relative aspect-square overflow-hidden bg-secondary/40"
      >
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.title}
            width={800}
            height={800}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            No photo
          </div>
        )}
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            New
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {product.categoryName && (
          <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
            {product.categoryName}
          </p>
        )}
        <Link
          to="/listing/$listingId"
          params={{ listingId: product.id }}
          className="line-clamp-2 text-pretty text-sm font-medium leading-snug hover:text-primary"
        >
          {product.title}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-display text-lg font-bold text-accent">
              {product.priceLabel}
            </p>
            {canBuy ? null : (
              <p className="text-xs text-muted-foreground">View details</p>
            )}
          </div>

          {canBuy ? (
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={alreadyMaxed || adding}
            >
              {added || alreadyMaxed ? (
                <Check className="size-4" />
              ) : (
                <ShoppingCart className="size-4" />
              )}
              {alreadyMaxed ? "In cart" : added ? "Added" : adding ? "Adding" : "Add"}
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/listing/$listingId" params={{ listingId: product.id }}>
                View
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
