import { KeyLink } from "@/components/key-button";
import { SHOP_CATEGORIES } from "@/lib/product-search";
import { useShopCategory } from "@/lib/shop-nav";

const SHORT: Record<string, string> = {
  desktops: "Desk",
  laptops: "Lap",
  components: "Parts",
  all: "All",
};

export function HeaderCategories() {
  const { active } = useShopCategory();

  return (
    <nav
      className="mr-1 hidden items-center gap-1 lg:flex"
      aria-label="Product categories"
    >
      {SHOP_CATEGORIES.map((c) =>
        c.id === "all" ? (
          <KeyLink key={c.id} to="/shop" size="sm" active={active === "all"}>
            All
          </KeyLink>
        ) : (
          <KeyLink
            key={c.id}
            to="/shop/$category"
            params={{ category: c.id }}
            size="sm"
            active={active === c.id}
          >
            {SHORT[c.id] ?? c.label}
          </KeyLink>
        ),
      )}
    </nav>
  );
}
