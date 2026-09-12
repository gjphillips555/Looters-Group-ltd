import { KeyButton, KeyLink } from "@/components/key-button";
import { SHOP_CATEGORIES, type ShopCategoryId } from "@/lib/product-search";
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
  const idx = current
    ? Math.max(0, SHOP_CATEGORIES.findIndex((c) => c.id === current))
    : -1;
  const cat = idx >= 0 ? SHOP_CATEGORIES[idx] : null;

  function go(delta: number) {
    const n = SHOP_CATEGORIES.length;
    const next =
      idx < 0
        ? SHOP_CATEGORIES[delta > 0 ? 0 : n - 1]
        : SHOP_CATEGORIES[(idx + delta + n) % n];
    openCategory(navigate, next.id);
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
          onClick={() => openCategory(navigate, "desktops")}
        >
          Select Category
        </KeyButton>
      ) : cat.id === "all" ? (
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
