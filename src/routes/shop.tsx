import { Outlet, createFileRoute } from "@tanstack/react-router";
import { getCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/shop")({
  loader: () => getCatalog(),
  component: ShopLayout,
});

function ShopLayout() {
  return <Outlet />;
}
