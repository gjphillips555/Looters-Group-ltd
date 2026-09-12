import { useEffect, useRef, useState } from "react";
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
}: {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  placeholder?: string;
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
      className={cn("flex min-w-0 items-stretch gap-1.5", className)}
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
      <KeyButton type="submit" size="sm" tone="teal" className="shrink-0">
        Search
      </KeyButton>
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
        className="kb-key kb-key-sm kb-white"
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
        <div className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border border-border bg-background p-2 shadow-xl">
          <ShopSearch autoFocus placeholder="Search Products" />
        </div>
      ) : null}
    </div>
  );
}
