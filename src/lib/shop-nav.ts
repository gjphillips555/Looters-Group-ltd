import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useOledGame } from "@/lib/oled-game";
import { useOledMode } from "@/lib/oled-mode";
import { SHOP_CATEGORIES, type ShopCategoryId } from "@/lib/product-search";

export type PadCategoryId = ShopCategoryId | "game";

export const PAD_CATEGORIES: { id: PadCategoryId; label: string }[] = [
  ...SHOP_CATEGORIES,
  { id: "game", label: "Game" },
];

export const CYCLE_LABEL: Record<PadCategoryId, string> = {
  desktops: "Desktops",
  laptops: "Laptops",
  components: "Components",
  all: "All products",
  game: "Game",
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
  const shopActive = categoryFromPath(pathname) ?? "all";
  const picked = useOledGame((s) => s.picked);
  const pick = useOledGame((s) => s.pick);
  const unpick = useOledGame((s) => s.unpick);
  const closeFlash = useOledMode((s) => s.closeFlash);
  const showFlash = useOledMode((s) => s.showFlash);
  const active: PadCategoryId = picked ? "game" : shopActive;

  function select(id: PadCategoryId) {
    if (id === "game") {
      closeFlash();
      pick();
      return;
    }
    unpick();
    showFlash(CYCLE_LABEL[id]);
    if (id === "all") void navigate({ to: "/shop" });
    else void navigate({ to: "/shop/$category", params: { category: id } });
  }

  function cycle(delta: number) {
    const n = PAD_CATEGORIES.length;
    const i = Math.max(0, PAD_CATEGORIES.findIndex((c) => c.id === active));
    const next = PAD_CATEGORIES[(i + delta + n) % n];
    select(next.id);
    return next;
  }

  return { active, select, cycle };
}

export function scrollPage(dir: "up" | "down") {
  if (typeof window === "undefined") return;
  const top = dir === "up" ? 0 : document.documentElement.scrollHeight;
  window.scrollTo({ top, behavior: "smooth" });
}
