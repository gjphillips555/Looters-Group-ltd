import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ExternalLink, MapPin, ShoppingCart, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { getProduct } from "@/lib/catalog";
import { cartProductFrom, isInCart, useCart } from "@/lib/cart-store";
import { nzd } from "@/lib/products";

export const Route = createFileRoute("/listing/$listingId")({
  loader: async ({ params }) => {
    const product = await getProduct({ data: { id: params.listingId } });
    if (!product) throw notFound();
    return product;
  },
  component: ListingPage,
  notFoundComponent: ListingNotFound,
});

function ListingNotFound() {
  return (
    <AppShell>
      <div className="py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Listing not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That item may have sold or been taken down.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to listings</Link>
        </Button>
      </div>
    </AppShell>
  );
}

function ListingPage() {
  const product = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const lines = useCart((s) => s.lines);
  const line = lines.find((l) => l.id === product.id);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const canBuy = product.buyNow && product.amount > 0;
  const inCart = isInCart(product.id, lines);
  const photos = product.photos.length > 0 ? product.photos : product.photo ? [product.photo] : [];
  const activePhoto = photos[photoIndex] ?? photos[0];

  function handleAdd() {
    if (!inCart) {
      add(cartProductFrom(product));
    }
    setAdded(true);
    toast.success("Added to cart", { description: product.title });
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <AppShell>
      <p className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Listings
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.categoryName ?? "Item"}</span>
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-square bg-secondary/40">
              {activePhoto ? (
                <img
                  src={activePhoto}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  No photo
                </div>
              )}
            </div>
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  className={`size-16 shrink-0 overflow-hidden rounded-md border ${
                    i === photoIndex ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {product.categoryName && (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.categoryName}
            </p>
          )}
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.title}
          </h1>
          {product.region && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {[product.suburb, product.region].filter(Boolean).join(", ")}
            </p>
          )}

          <div>
            <p className="font-display text-3xl font-bold text-accent">
              {product.priceLabel}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.buyNow
                ? product.maxQty <= 1
                  ? "Buy Now · 1 available · GST inclusive"
                  : `Buy Now · up to ${product.maxQty} · GST inclusive`
                : "Auction on TradeMe"}
            </p>
          </div>

          {canBuy && product.shipping.length > 0 && (
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Truck className="size-3.5" /> Shipping options
              </p>
              <ul className="space-y-1.5">
                {product.shipping.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium tabular-nums">
                      {s.price > 0 ? nzd(s.price) : "Free"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.attributes.length > 0 && (
            <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border p-4">
              {product.attributes.map((a) => (
                <div key={a.name}>
                  <dt className="text-xs text-muted-foreground">{a.name}</dt>
                  <dd className="text-sm font-medium">{a.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {canBuy ? (
              <>
                {inCart && product.maxQty > 1 && line && (
                  <QuantityStepper
                    value={line.qty}
                    max={product.maxQty}
                    onChange={(q) => setQty(product.id, q)}
                  />
                )}
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleAdd}
                  disabled={inCart && product.maxQty <= 1}
                >
                  {added || (inCart && product.maxQty <= 1) ? (
                    <Check />
                  ) : (
                    <ShoppingCart />
                  )}
                  {inCart && product.maxQty <= 1
                    ? "In cart"
                    : added
                      ? "Added"
                      : inCart
                        ? "Add another"
                        : "Add to cart"}
                </Button>
                {inCart && (
                  <Button asChild variant="outline">
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button asChild>
                <a href={product.listingUrl} target="_blank" rel="noopener noreferrer">
                  View auction on TradeMe <ExternalLink />
                </a>
              </Button>
            )}
          </div>

          <a
            href={product.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Open original TradeMe listing <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {product.description && (
        <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="mb-3 font-display text-lg font-semibold">Description</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </section>
      )}
    </AppShell>
  );
}
