import { create } from "zustand";
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
  ...Object.fromEntries(SHOP_CATEGORIES.map((c) => [c.id, c.label])),
  game: "Game",
} as Record<PadCategoryId, string>;

export const usePadSelect = create<{
  pending: PadCategoryId | null;
  setPending: (id: PadCategoryId | null) => void;
}>((set) => ({
  pending: null,
  setPending: (pending) => set({ pending }),
}));

export function categoryFromPath(pathname: string): ShopCategoryId | undefined {
  if (pathname === "/shop") return "all";
  const hit = pathname.match(/^\/shop\/([a-z]+)$/);
  if (hit && SHOP_CATEGORIES.some((c) => c.id === hit[1])) {
    return hit[1] as ShopCategoryId;
  }
  return undefined;
}

export function useShopCategory() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shopActive = categoryFromPath(pathname) ?? "all";
  const pending = usePadSelect((s) => s.pending);
  const setPending = usePadSelect((s) => s.setPending);
  const picked = useOledGame((s) => s.picked);
  const pick = useOledGame((s) => s.pick);
  const unpick = useOledGame((s) => s.unpick);
  const stopGame = useOledGame((s) => s.stop);
  const closeFlash = useOledMode((s) => s.closeFlash);
  const closeHelp = useOledMode((s) => s.closeHelp);
  const cursor: PadCategoryId = pending ?? (picked ? "game" : shopActive);

  function cycle(delta: number) {
    stopGame();
    closeHelp();
    closeFlash();
    const n = PAD_CATEGORIES.length;
    const i = Math.max(0, PAD_CATEGORIES.findIndex((c) => c.id === cursor));
    const next = PAD_CATEGORIES[(i + delta + n) % n];
    if (next.id !== "game") unpick();
    setPending(next.id);
    return next;
  }

  function commit() {
    if (!pending) return false;
    const id = pending;
    closeHelp();
    closeFlash();
    if (id === "game") {
      pick();
      setPending("game");
      return true;
    }
    unpick();
    setPending(null);
    if (id === "all") void navigate({ to: "/shop" });
    else void navigate({ to: "/shop/$category", params: { category: id } });
    return true;
  }

  function cancel() {
    setPending(null);
    unpick();
    stopGame();
  }

  return { active: cursor, pending, cycle, commit, cancel };
}

export function scrollPage(dir: "up" | "down") {
  if (typeof window === "undefined") return;
  const top = dir === "up" ? 0 : document.documentElement.scrollHeight;
  window.scrollTo({ top, behavior: "smooth" });
}
