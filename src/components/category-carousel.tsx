import { KeyButton, KeyLink } from "@/components/key-button";
import { SHOP_CATEGORIES, type ShopCategoryId } from "@/lib/product-search";
import { categoryFromPath } from "@/lib/shop-nav";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export function CategoryCarousel() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current: ShopCategoryId = categoryFromPath(pathname) ?? "desktops";
  const idx = Math.max(
    0,
    SHOP_CATEGORIES.findIndex((c) => c.id === current),
  );
  const cat = SHOP_CATEGORIES[idx];

  function go(delta: number) {
    const n = SHOP_CATEGORIES.length;
    const next = SHOP_CATEGORIES[(idx + delta + n) % n];
    if (next.id === "all") void navigate({ to: "/shop" });
    else void navigate({ to: "/shop/$category", params: { category: next.id } });
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
      {cat.id === "all" ? (
        <KeyLink to="/shop" tone="teal" className="kb-spacebar cat-carousel-mid">
          {cat.label}
        </KeyLink>
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
