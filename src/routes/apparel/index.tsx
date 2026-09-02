import { createFileRoute } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { ProductCard } from "@/components/product-card";
import { AfterpayMark } from "@/components/afterpay-mark";
import { APPAREL_PRODUCTS } from "@/data/catalog";
import { useStoreListings } from "@/lib/listings";

export const Route = createFileRoute("/apparel/")({ component: ApparelHome });

function ApparelHome() {
  const products = useStoreListings("apparel", APPAREL_PRODUCTS);
  const originals = products.filter((p) => p.madeToOrder);
  const second = products.filter((p) => !p.madeToOrder);

  return (
    <BranchShell branch="apparel">
      <main>
        <section className="bg-apparel text-cream">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">
              Looters Stores · Apparel
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
              Originals you can wear. Second-life if it’s already made.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/85">
              The glitch-skull tee and OFFLINE hoodie will list on Trade Me like
              everything else. Leave your size if you want one. Second-life is
              near-new 2nd-hand. Afterpay accepted at Looters Stores.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-8">
            <AfterpayMark className="h-20 w-auto" />
          </div>
          <h2 className="font-display text-2xl font-extrabold">Looters Originals</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Same graphic on both. Hoodie gets OFFLINE down the sleeve. Sales on
            Trade Me — no paid printers, no card checkout here.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {originals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <h2 className="mt-14 font-display text-2xl font-extrabold">Second-life · near new</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Anything labelled APARL on Trade Me lands here — not on Computas.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {second.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
    </BranchShell>
  );
}
