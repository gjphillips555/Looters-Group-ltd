import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { AfterpayMark } from "@/components/afterpay-mark";
import { ApparelOrder } from "@/components/apparel-order";
import { ResponsiveImage } from "@/components/responsive-image";
import { productImages } from "@/data/catalog";
import { useListing } from "@/lib/listings";
import { formatNzd } from "@/lib/utils";

export const Route = createFileRoute("/apparel/$id")({ component: ApparelItem });

function ApparelItem() {
  const { id } = Route.useParams();
  const { product, ready } = useListing(id);
  const [active, setActive] = useState(0);

  if (!ready) {
    return (
      <BranchShell branch="apparel">
        <main className="mx-auto max-w-6xl px-4 py-10">
          <div className="h-80 animate-pulse rounded-3xl bg-line" />
        </main>
      </BranchShell>
    );
  }
  if (!product || product.branch !== "apparel") throw notFound();
  const photos = productImages(product);

  return (
    <BranchShell branch="apparel">
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div>
          <ResponsiveImage
            src={photos[active] ?? product.image}
            alt={product.title}
            width={1200}
            height={1200}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="w-full rounded-3xl object-cover"
          />
          {photos.length > 1 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((src, i) => (
                <button
                  key={src}
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
                    width={200}
                    height={200}
                    sizes="120px"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-apparel">
            {product.category}
            {product.madeToOrder ? " · originals" : " · second-life"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">{product.title}</h1>
          <p className="mt-3 font-display text-3xl font-bold tabular-nums">{formatNzd(product.price)}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.blurb}</p>
          <ul className="mt-6 space-y-1.5 text-sm">
            {product.specs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {product.madeToOrder ? <ApparelOrder product={product} /> : (
            <p className="mt-8 text-sm text-muted">
              Second-life, near-new. Ask in store at Kilbirnie — sales aren’t checked
              out on this site.
            </p>
          )}
          <div className="mt-5">
            <AfterpayMark className="h-16 w-auto" />
          </div>
          <Link to="/apparel" className="mt-6 inline-block text-sm hover:underline">
            All apparel
          </Link>
        </div>
      </main>
    </BranchShell>
  );
}
