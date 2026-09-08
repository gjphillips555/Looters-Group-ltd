import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProductSearch } from "@/lib/product-search";
import { cn } from "@/lib/utils";

export function ShopSearch({
  className,
  inputClassName,
  autoFocus = false,
}: {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
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
        autoFocus={autoFocus}
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

export function MobileSearchToggle() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  return (
    <div ref={wrap} className="relative md:hidden">
      <button
        type="button"
        className="kb-key kb-key-sm"
        aria-label="Search products"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        data-active={open ? "true" : "false"}
      >
        <span className="kb-cap">
          <Search className="size-4" />
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(18.5rem,calc(100vw-1.5rem))] rounded-xl border border-border bg-background p-2 shadow-xl">
          <ShopSearch autoFocus />
        </div>
      ) : null}
    </div>
  );
}
