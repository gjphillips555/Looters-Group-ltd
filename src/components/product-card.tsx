import { useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ExternalLink, MapPin, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cartProductFrom, isInCart, useCart } from "@/lib/cart-store";
import { nzd, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const lines = useCart((s) => s.lines);
  const [added, setAdded] = useState(false);
  const canBuy = product.buyNow && product.amount > 0;
  const inCart = isInCart(product.id, lines);
  const singleOnly = product.maxQty <= 1;
  const alreadyMaxed = inCart && singleOnly;

  function handleAdd(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add(cartProductFrom(product));
    setAdded(true);
    toast.success("Added to cart", { description: product.title });
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50">
      <Link
        to="/listing/$listingId"
        params={{ listingId: product.id }}
        className="relative aspect-square overflow-hidden bg-secondary/40"
      >
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
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

        {product.region && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {product.suburb ? `${product.suburb}, ` : ""}
            {product.region}
          </p>
        )}

        {canBuy && product.shipping.length > 0 && (
          <div className="rounded-lg border border-border/70 bg-secondary/30 p-2.5">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Truck className="size-3.5" /> Shipping options
            </p>
            <ul className="space-y-1">
              {product.shipping.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="min-w-0 truncate text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-foreground">
                    {s.price > 0 ? nzd(s.price) : "Free"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-display text-lg font-bold text-accent">
              {product.priceLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.buyNow
                ? singleOnly
                  ? "Buy Now · 1 available"
                  : `Buy Now · up to ${product.maxQty}`
                : "Auction"}
            </p>
          </div>

          {canBuy ? (
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={alreadyMaxed}
            >
              {added || alreadyMaxed ? (
                <Check className="size-4" />
              ) : (
                <ShoppingCart className="size-4" />
              )}
              {alreadyMaxed ? "In cart" : added ? "Added" : "Add"}
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <a
                href={product.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View <ExternalLink className="size-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
