import { KeyButton, KeyLink } from "@/components/key-button";
import {
  SHOP_CATEGORIES,
  SHOP_CATEGORY_PAGES,
  type ShopCategoryId,
  type ShopCategoryPage,
} from "@/lib/product-search";
import { categoryFromPath } from "@/lib/shop-nav";
import { useNavigate, useRouterState } from "@tanstack/react-router";

function openCategory(navigate: ReturnType<typeof useNavigate>, id: ShopCategoryId) {
  if (id === "all") void navigate({ to: "/shop" });
  else void navigate({ to: "/shop/$category", params: { category: id } });
}

export function CategoryCarousel() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const current = categoryFromPath(pathname);
  const pages = SHOP_CATEGORY_PAGES;
  const idx = pages.findIndex((id) => id === current);
  const cat =
    current && current !== "all"
      ? SHOP_CATEGORIES.find((c) => c.id === current) ?? null
      : null;

  function go(delta: number) {
    const n = pages.length;
    const next: ShopCategoryPage =
      idx < 0
        ? pages[delta > 0 ? 0 : n - 1]
        : pages[(idx + delta + n) % n];
    openCategory(navigate, next);
  }

  return (
    <nav className="cat-carousel" aria-label="Product categories">
      <KeyButton
        size="sm"
        tone="teal"
        className="cat-carousel-arrow"
        aria-label="Previous category"
        onClick={() => go(-1)}
      >
        <span className="kb-dual">
          <b>{"<"}</b>
          <i>,</i>
        </span>
      </KeyButton>
      {onHome || !cat ? (
        <KeyButton
          tone="teal"
          className="kb-spacebar cat-carousel-mid"
          aria-label="Select a category"
          onClick={() => go(1)}
        >
          Select Category
        </KeyButton>
      ) : (
        <KeyLink
          to="/shop/$category"
          params={{ category: cat.id }}
          tone="teal"
          className="kb-spacebar cat-carousel-mid"
        >
          {cat.label}
        </KeyLink>
      )}
      <KeyButton
        size="sm"
        tone="teal"
        className="cat-carousel-arrow"
        aria-label="Next category"
        onClick={() => go(1)}
      >
        <span className="kb-dual">
          <b>{">"}</b>
          <i>.</i>
        </span>
      </KeyButton>
    </nav>
  );
}
