import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BrandTicker } from "@/components/brand-ticker";
import { ProductGrid } from "@/components/product-grid";
import { ARTWORK } from "@/lib/artwork";
import { getCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: ARTWORK.buildSpec,
        type: "image/webp",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const catalog = Route.useLoaderData();

  return (
    <AppShell>
      <BrandTicker />
      <section className="mb-8 grid items-center gap-6 rounded-2xl border border-border bg-card px-4 py-5 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-8 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:px-8">
        <img
          src={ARTWORK.buildSpec}
          alt="Refurbished Core i7-6700 desktop: Windows 11 Pro, 8 GB DDR4, 128 GB NVMe, Sapphire R7 360"
          width={720}
          height={1072}
          fetchPriority="high"
          decoding="async"
          className="mx-auto w-full max-w-[280px] rounded-xl sm:max-w-none"
        />
        <div className="flex flex-col gap-3">
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Loot the best deals on refurbished gear
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every item below is live from the LootersRetail store. Add finds to
            your cart, pick shipping on the product page, and we'll tally
            your total in NZD.
          </p>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Browse the loot</h2>
        <p className="text-sm text-muted-foreground">
          {catalog.products.length} finds below
        </p>
      </div>

      <ProductGrid products={catalog.products} error={catalog.error} />
    </AppShell>
  );
}
