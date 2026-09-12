import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { KeyButton } from "@/components/key-button";
import { useProductSearch } from "@/lib/product-search";
import { cn } from "@/lib/utils";

export function ShopSearch({
  className,
  inputClassName,
  autoFocus = false,
  placeholder = "Search Products",
  showButton = true,
}: {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  placeholder?: string;
  showButton?: boolean;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const query = useProductSearch((s) => s.query);
  const setQuery = useProductSearch((s) => s.setQuery);

  function goShop() {
    if (pathname !== "/shop") void navigate({ to: "/shop" });
  }

  return (
    <form
      className={cn("flex min-w-0 items-center gap-1.5", className)}
      onSubmit={(e) => {
        e.preventDefault();
        goShop();
      }}
    >
      <span className="kb-key kb-key-sm kb-white kb-search-key min-w-0 flex-1">
        <span className="kb-cap">
          <Search className="size-3.5 shrink-0" />
          <input
            value={query}
            autoFocus={autoFocus}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search products"
            className={cn("kb-search-input", inputClassName)}
          />
        </span>
      </span>
      {showButton ? (
        <KeyButton type="submit" size="sm" tone="teal" className="shrink-0">
          Search
        </KeyButton>
      ) : null}
    </form>
  );
}
