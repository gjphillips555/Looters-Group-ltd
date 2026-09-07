import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ProductGrid } from "@/components/product-grid";
import { getCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  component: Home,
});

function Home() {
  const catalog = Route.useLoaderData();
  const seller = catalog.seller;

  return (
    <AppShell>
      <section className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 py-8 sm:px-8">
        <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          Live from TradeMe
        </span>
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Loot the best deals, straight from our TradeMe store
        </h1>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every item below is pulled live from the LootersRetail TradeMe
          listings. Add Buy Now finds to your cart, adjust quantities, and
          we'll tally your total in NZD — all without touching a thing on
          TradeMe.
        </p>
        {seller && (
          <p className="text-sm text-muted-foreground">
            Seller{" "}
            <span className="font-medium text-foreground">{seller.nickname}</span>
            {seller.suburb || seller.region
              ? ` · ${[seller.suburb, seller.region].filter(Boolean).join(", ")}`
              : ""}
            {seller.positive > 0
              ? ` · ${seller.positive} positive feedback`
              : ""}
          </p>
        )}
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Current listings</h2>
        <p className="text-sm text-muted-foreground">
          {catalog.products.length} live
        </p>
      </div>

      <ProductGrid products={catalog.products} error={catalog.error} />
    </AppShell>
  );
}
