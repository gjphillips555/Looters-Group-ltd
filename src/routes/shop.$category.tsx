import { createFileRoute, notFound } from "@tanstack/react-router";
import { ShopCatalog } from "@/components/shop-catalog";
import { getCatalog } from "@/lib/catalog";
import { isShopCategoryPage } from "@/lib/product-search";

export const Route = createFileRoute("/shop/$category")({
  beforeLoad: ({ params }) => {
    if (!isShopCategoryPage(params.category)) throw notFound();
  },
  loader: () => getCatalog(),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  if (!isShopCategoryPage(category)) throw notFound();
  return <ShopCatalog catalog={Route.useLoaderData()} category={category} />;
}
