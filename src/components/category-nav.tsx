import { Link, useRouterState } from "@tanstack/react-router";
import { SHOP_CATEGORIES, type ShopCategoryId } from "@/lib/product-search";
import { categoryFromPath } from "@/lib/shop-nav";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current: ShopCategoryId | undefined =
    pathname === "/" ? undefined : categoryFromPath(pathname);

  return (
    <nav className="cat-nav" aria-label="Product categories">
      {SHOP_CATEGORIES.map((cat) => {
        const active = current === cat.id;
        const className = cn("cat-nav-item", active && "is-active");
        if (cat.id === "all") {
          return (
            <Link
              key={cat.id}
              to="/shop"
              className={className}
              aria-current={active ? "page" : undefined}
            >
              {cat.label}
            </Link>
          );
        }
        return (
          <Link
            key={cat.id}
            to="/shop/$category"
            params={{ category: cat.id }}
            className={className}
            aria-current={active ? "page" : undefined}
          >
            {cat.label}
          </Link>
        );
      })}
    </nav>
  );
}
