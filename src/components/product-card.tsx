import { useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { KeyButton, KeyLink } from "@/components/key-button";
import { getProduct } from "@/lib/catalog";
import { cartProductFrom, isInCart, useCart } from "@/lib/cart-store";
import { categoryBadge } from "@/lib/product-search";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
  cycleImages = false,
  priority = false,
  imageFit = "cover",
}: {
  product: Product;
  className?: string;
  cycleImages?: boolean;
  priority?: boolean;
  imageFit?: "cover" | "contain";
}) {
  const add = useCart((s) => s.add);
  const lines = useCart((s) => s.lines);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [shot, setShot] = useState(0);
  const canBuy = product.buyNow && product.amount > 0;
  const inCart = isInCart(product.id, lines);
  const singleOnly = product.maxQty <= 1;
  const alreadyMaxed = inCart && singleOnly;
  const gallery =
    product.photos.length > 0
      ? product.photos
      : product.photo
        ? [product.photo]
        : [];
  const canCycle = cycleImages && gallery.length > 1;
  const current = gallery[shot] ?? product.photo;

  function step(e: MouseEvent, delta: number) {
    e.preventDefault();
    e.stopPropagation();
    setShot((i) => (i + delta + gallery.length) % gallery.length);
  }

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
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <Link
          to="/listing/$listingId"
          params={{ listingId: product.id }}
          className="block h-full w-full"
        >
          {current ? (
            <img
              src={current}
              alt={product.title}
              width={640}
              height={640}
              sizes="(max-width: 768px) 80vw, 28vw"
              className={cn(
                "h-full w-full",
                imageFit === "contain"
                  ? "object-contain p-3"
                  : "object-cover transition-transform duration-300 group-hover:scale-105",
              )}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "low"}
              decoding="async"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
        </Link>
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            New
          </span>
        )}
        {canCycle && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => step(e, -1)}
              className="absolute left-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 shadow-sm hover:bg-secondary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => step(e, 1)}
              className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 shadow-sm hover:bg-secondary"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-1.5 rounded-full",
                    i === shot ? "bg-accent" : "bg-white/70",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
          {categoryBadge(product)}
        </p>
        <Link
          to="/listing/$listingId"
          params={{ listingId: product.id }}
          className="line-clamp-2 text-pretty text-sm font-medium leading-snug hover:text-primary"
        >
          {product.title}
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-display text-lg font-bold text-[#ff9a00]">
              {product.priceLabel}
            </p>
            {canBuy ? null : (
              <p className="text-xs text-muted-foreground">View details</p>
            )}
          </div>

          {canBuy ? (
            <KeyButton
              size="sm"
              tone="teal"
              onClick={handleAdd}
              disabled={alreadyMaxed || adding}
            >
              {added || alreadyMaxed ? (
                <Check className="size-4" />
              ) : (
                <ShoppingCart className="size-4" />
              )}
              {alreadyMaxed ? "In cart" : added ? "Added" : adding ? "Adding" : "Add"}
            </KeyButton>
          ) : (
            <KeyLink
              size="sm"
              to="/listing/$listingId"
              params={{ listingId: product.id }}
            >
              View
            </KeyLink>
          )}
        </div>
      </div>
    </article>
  );
}
