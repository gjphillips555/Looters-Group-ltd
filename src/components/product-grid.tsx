import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { useProductSearch } from "@/lib/product-search";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  error,
}: {
  products: Product[];
  error?: string;
}) {
  const query = useProductSearch((s) => s.query);
  const setQuery = useProductSearch((s) => s.setQuery);
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.categoryName) set.add(p.categoryName);
    }
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.categoryName !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.categoryName ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [products, query, category]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 py-24 text-center text-muted-foreground">
        <AlertCircle className="size-8 text-destructive" />
        <p className="font-medium text-foreground">Couldn't load products</p>
        <p className="text-sm">
          The catalog is temporarily unavailable. Please try again shortly.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        No products right now — check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 md:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </FilterChip>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No products match that search.
        </div>
      ) : (
        <ProductCarousel products={filtered} />
      )}
    </div>
  );
}

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

function ProductCarousel({ products }: { products: Product[] }) {
  const desktop = useDesktop();
  const perView = desktop ? Math.min(3, products.length) : 1;
  const maxIndex = Math.max(0, products.length - perView);
  const [index, setIndex] = useState(0);
  const drag = useRef({ x: 0, active: false, dx: 0 });

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex, products.length]);

  function go(next: number) {
    setIndex(Math.max(0, Math.min(maxIndex, next)));
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, active: true, dx: 0 };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.x;
  }

  function onPointerUp() {
    if (!drag.current.active) return;
    const dx = drag.current.dx;
    drag.current.active = false;
    if (dx > 50) go(index - 1);
    else if (dx < -50) go(index + 1);
  }

  const slidePct = desktop ? 100 / perView : 72;
  const trackTransform = desktop
    ? `translateX(-${index * slidePct}%)`
    : `translateX(calc(14% - ${index} * 72%))`;

  return (
    <div className="space-y-4">
      <div
        className="relative"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="overflow-hidden">
          <div
            className="flex w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: trackTransform }}
          >
            {products.map((product, i) => {
              const faded = !desktop && i !== index;
              return (
                <div
                  key={product.id}
                  className="relative shrink-0 px-1.5 md:px-2"
                  style={{ flexBasis: `${slidePct}%` }}
                >
                  <div
                    className={cn(
                      "h-full transition-[opacity,transform] duration-500",
                      faded ? "scale-95 opacity-40" : "scale-100 opacity-100",
                    )}
                  >
                    <ProductCard product={product} className="h-full" />
                  </div>
                  {faded && (
                    <button
                      type="button"
                      className="absolute inset-0 z-10"
                      aria-label={`Show ${product.title}`}
                      onClick={() => go(i)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {maxIndex > 0 && (
          <>
            <CarouselArrow
              side="left"
              disabled={index <= 0}
              onClick={() => go(index - 1)}
            />
            <CarouselArrow
              side="right"
              disabled={index >= maxIndex}
              onClick={() => go(index + 1)}
            />
          </>
        )}
      </div>

      {products.length > perView && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to set ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index
                  ? "w-6 bg-accent"
                  : "w-2 bg-muted-foreground/35 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous products" : "Next products"}
      className={cn(
        "absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur transition-opacity",
        side === "left" ? "left-1 md:-left-3" : "right-1 md:-right-3",
        disabled ? "opacity-30" : "hover:bg-secondary",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
