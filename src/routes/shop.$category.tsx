import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopCatalog } from "@/components/shop-catalog";
import { isShopCategoryPage } from "@/lib/product-search";
import { Route as ShopRoute } from "./shop";

export const Route = createFileRoute("/shop/$category")({
  beforeLoad: ({ params }) => {
    if (!isShopCategoryPage(params.category)) throw notFound();
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  if (!isShopCategoryPage(category)) throw notFound();
  const catalog = ShopRoute.useLoaderData();
  return <ShopCatalog catalog={catalog} category={category} />;
}
