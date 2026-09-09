import { useNavigate, useRouterState } from "@tanstack/react-router";
import { SHOP_CATEGORIES, type ShopCategoryId } from "@/lib/product-search";

export const CYCLE_LABEL: Record<ShopCategoryId, string> = {
  desktops: "Desktops",
  laptops: "Laptops",
  components: "Components",
  all: "All products",
};

export function categoryFromPath(pathname: string): ShopCategoryId | undefined {
  if (pathname === "/shop/desktops") return "desktops";
  if (pathname === "/shop/laptops") return "laptops";
  if (pathname === "/shop/components") return "components";
  if (pathname === "/shop") return "all";
  return undefined;
}

export function useShopCategory() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = categoryFromPath(pathname) ?? "all";

  function select(id: ShopCategoryId) {
    if (id === "all") void navigate({ to: "/shop" });
    else void navigate({ to: "/shop/$category", params: { category: id } });
  }

  function cycle(delta: number) {
    const n = SHOP_CATEGORIES.length;
    const i = SHOP_CATEGORIES.findIndex((c) => c.id === active);
    const next = SHOP_CATEGORIES[(i + delta + n) % n];
    select(next.id);
  }

  return { active, select, cycle };
}

export function scrollPage(dir: "up" | "down") {
  if (typeof window === "undefined") return;
  const top = dir === "up" ? 0 : document.documentElement.scrollHeight;
  window.scrollTo({ top, behavior: "smooth" });
}
