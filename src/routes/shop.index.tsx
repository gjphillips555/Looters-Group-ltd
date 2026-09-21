import { createFileRoute } from "@tanstack/react-router";
import { ShopCatalog } from "@/components/shop-catalog";
import { Route as ShopRoute } from "./shop";

export const Route = createFileRoute("/shop/")({
  component: ShopIndex,
});

function ShopIndex() {
  const catalog = ShopRoute.useLoaderData();
  return <ShopCatalog catalog={catalog} category="all" />;
}
