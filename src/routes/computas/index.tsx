import { createFileRoute, Link } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { ProductCard } from "@/components/product-card";
import { STORE } from "@/data/catalog";
import { useStoreListings } from "@/lib/listings";
import { PromoVideo } from "@/components/promo-video";

export const Route = createFileRoute("/computas/")({ component: ComputasHome });

function ComputasHome() {
  const products = useStoreListings("computas", []);
  return (
    <BranchShell branch="computas">
      <main>
        <section className="border-b border-line bg-computas text-cream">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">
                Looters · Computas
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
                Refurbished machines, tested parts, Wellington pickup.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/80">
                Quality refurbished laptops and desktops, tested for work, study or
                home. All our systems are sold Refurbished unless stated that they
                are sold As-Is. All refurbished systems have fresh CMOS batteries,
                are freshly cleaned out, and usually have a fresh install of a
                suitable operating system for that device.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/computas/shop"
                  className="inline-flex min-h-12 items-center rounded-full bg-computas-hot px-5 text-sm font-semibold text-cream"
                >
                  Shop listings
                </Link>
                <Link
                  to="/computas/policy"
                  className="inline-flex min-h-12 items-center rounded-full bg-cream/10 px-5 text-sm font-semibold"
                >
                  Store policy
                </Link>
              </div>
            </div>
            <img
              src="/brand/storefront.jpg"
              alt="Looters Computas shopfront"
              className="media h-64 w-full rounded-3xl object-cover md:h-80"
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold">Latest products</h2>
            <Link to="/computas/shop" className="text-sm font-semibold hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.length === 0 ? (
            <p className="mt-8 text-sm text-muted">Loading live Trade Me listings…</p>
          ) : null}
        </section>

        <section className="border-y border-line bg-cream/50 py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center font-display text-2xl font-extrabold">
              The Shoshana Sale
            </h2>
            <p className="mt-2 text-center text-sm text-muted">
              10% off with Lootzy — watch the promo, then shop live listings.
            </p>
            <div className="mt-6">
              <PromoVideo />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                t: "We’ve just opened",
                d: "Lootzy the penguin was on the footpath handing out 10% off vouchers. Come in — refurbished systems in the window and a team ready to help.",
              },
              {
                t: "Why shop with us",
                d: "Systems tested before listing. Competitive pricing for students, home users and small business. A practical option instead of sending working electronics to landfill.",
              },
              {
                t: STORE.address[0],
                d: STORE.address.slice(1).join(", ") + ". Afterpay accepted. " + STORE.warranty,
              },
            ].map((c) => (
              <article key={c.t} className="rounded-3xl bg-cream p-6 shadow-border">
                <h3 className="font-display text-lg font-bold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 overflow-hidden rounded-3xl">
            <img
              src="/brand/store-map-mock.png"
              alt="Map — Looters Computas, 6 Ruru Avenue, Kilbirnie"
              className="media w-full bg-cream object-cover"
            />
          </div>
        </section>
      </main>
    </BranchShell>
  );
}
