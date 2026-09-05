import { createFileRoute, Link, Navigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ResponsiveImage } from "@/components/responsive-image";
import { BuyPanel } from "@/components/buy-panel";
import { productImages } from "@/data/catalog";
import { useListing, useStoreListings } from "@/lib/listings";
import { formatNzd } from "@/lib/utils";
import { AfterpayMark } from "@/components/afterpay-mark";

export const Route = createFileRoute("/computas/shop/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { product, ready } = useListing(id);
  const relatedAll = useStoreListings("computas", []);
  const [active, setActive] = useState(0);

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-80 animate-pulse rounded-3xl bg-line" />
      </main>
    );
  }
  if (product?.branch === "apparel") {
    return <Navigate to="/apparel/$id" params={{ id }} />;
  }
  if (!product || product.branch !== "computas") throw notFound();

  const photos = productImages(product);
  const related = relatedAll
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs text-muted">
        <Link to="/computas/shop" className="hover:underline">
          Shop
        </Link>
        <span> / {product.category}</span>
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-cream">
            <ResponsiveImage
              src={photos[active] ?? product.image}
              alt={product.title}
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="aspect-[4/3] w-full object-contain"
            />
          </div>
          {photos.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {photos.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    i === active
                      ? "overflow-hidden rounded-xl ring-2 ring-ink"
                      : "overflow-hidden rounded-xl ring-1 ring-line"
                  }
                >
                  <ResponsiveImage
                    src={src}
                    alt=""
                    width={160}
                    height={160}
                    sizes="80px"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {product.category} · listing #{product.listingId}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">{product.title}</h1>
          <p className="mt-3 font-display text-3xl font-bold tabular-nums text-computas-hot">
            {formatNzd(product.price)}
          </p>
          <p className="mt-2 text-sm font-medium text-computas">{product.condition}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.blurb}</p>

          <h2 className="mt-8 font-display text-lg font-bold">Specs</h2>
          <ul className="mt-3 divide-y divide-line rounded-2xl bg-cream px-4 shadow-border">
            {product.specs.map((s) => (
              <li key={s} className="py-2.5 text-sm text-ink/90">
                {s}
              </li>
            ))}
          </ul>

          <BuyPanel product={product} />

          <p className="mt-6 text-sm text-muted">
            Afterpay is available on Trade Me checkout. 90-day return-to-base hardware warranty
            on most listings unless sold as-is.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <AfterpayMark className="h-16 w-auto" />
            <img
              src="/brand/logos/badge.png"
              alt="90 day warranty"
              className="h-12 w-auto"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold">More in {product.category}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
