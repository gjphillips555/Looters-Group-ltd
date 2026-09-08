import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  productInCategory,
  useProductSearch,
} from "@/lib/product-search";
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
  const category = useProductSearch((s) => s.category);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (!productInCategory(p, category)) return false;
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

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No products match that search.
      </div>
    );
  }

  return <ProductCarousel products={filtered} />;
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
  const n = products.length;
  const perView = desktop ? Math.min(3, n) : 1;
  const loop = n > 1;
  const [index, setIndex] = useState(() => (loop ? n : 0));
  const [anim, setAnim] = useState(true);
  const drag = useRef({ x: 0, active: false, dx: 0 });

  useEffect(() => {
    setAnim(false);
    setIndex(loop ? n : 0);
  }, [n, loop, products]);

  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => setAnim(true));
    return () => cancelAnimationFrame(id);
  }, [anim, index]);

  const slides = loop ? [...products, ...products, ...products] : products;

  function go(delta: number) {
    if (!loop) return;
    setAnim(true);
    setIndex((i) => i + delta);
  }

  function settle() {
    if (!loop) return;
    if (index < n) {
      setAnim(false);
      setIndex(index + n);
    } else if (index >= n * 2) {
      setAnim(false);
      setIndex(index - n);
    }
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!loop) return;
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
    if (dx > 50) go(-1);
    else if (dx < -50) go(1);
  }

  const slidePct = desktop ? 100 / perView : 72;
  const trackTransform = desktop
    ? `translateX(-${index * slidePct}%)`
    : `translateX(calc(14% - ${index} * 72%))`;
  const real = n ? ((index % n) + n) % n : 0;

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
            className={cn(
              "flex w-full",
              anim && "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            )}
            style={{ transform: trackTransform }}
            onTransitionEnd={(e) => {
              if (e.target !== e.currentTarget) return;
              settle();
            }}
          >
            {slides.map((product, i) => {
              const faded = !desktop && i !== index;
              return (
                <div
                  key={`${product.id}-${i}`}
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
                      onClick={() => go(i - index)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {loop && (
          <>
            <CarouselArrow side="left" onClick={() => go(-1)} />
            <CarouselArrow side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      {loop && (
        <div className="flex items-center justify-center gap-1.5">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to ${p.title}`}
              onClick={() => {
                setAnim(true);
                setIndex(n + i);
              }}
              className={cn(
                "h-2 rounded-full transition-all",
                i === real
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
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous products" : "Next products"}
      className={cn(
        "absolute top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur hover:bg-secondary",
        side === "left" ? "left-1 md:-left-3" : "right-1 md:-right-3",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
