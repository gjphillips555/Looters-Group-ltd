import { createFileRoute } from "@tanstack/react-router";
import { ShopCatalog } from "@/components/shop-catalog";
import { getCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/shop")({
  loader: () => getCatalog(),
  component: ShopPage,
});

function ShopPage() {
  return <ShopCatalog catalog={Route.useLoaderData()} category="all" />;
}
