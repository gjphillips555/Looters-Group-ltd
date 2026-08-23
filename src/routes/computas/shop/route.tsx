import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/computas/shop")({
  component: ShopLayout,
});

function ShopLayout() {
  return (
    <BranchShell branch="computas">
      <Outlet />
    </BranchShell>
  );
}
