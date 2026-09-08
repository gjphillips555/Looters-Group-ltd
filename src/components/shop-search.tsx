import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProductSearch } from "@/lib/product-search";
import { cn } from "@/lib/utils";

export function ShopSearch({
  className,
  inputClassName,
}: {
  className?: string;
  inputClassName?: string;
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
      className={cn("relative min-w-0", className)}
      onSubmit={(e) => {
        e.preventDefault();
        goShop();
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          goShop();
        }}
        placeholder="Search products"
        aria-label="Search products"
        className={cn("h-10 bg-secondary/40 pl-9", inputClassName)}
      />
    </form>
  );
}
