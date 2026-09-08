import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ClockWidget } from "@/components/clock-widget";
import { ProductGrid } from "@/components/product-grid";
import { getCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  component: Home,
});

function Home() {
  const catalog = Route.useLoaderData();

  return (
    <AppShell>
      <section className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card px-6 py-8 sm:px-8">
        <ClockWidget />
        <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Loot the best deals on refurbished gear
        </h1>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every item below is live from the LootersRetail store. Add finds to
          your cart, pick shipping on the product page, and we'll tally
          your total in NZD.
        </p>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">In stock</h2>
        <p className="text-sm text-muted-foreground">
          {catalog.products.length} live
        </p>
      </div>

      <ProductGrid products={catalog.products} error={catalog.error} />
    </AppShell>
  );
}
