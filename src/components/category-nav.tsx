import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BrandTicker } from "@/components/brand-ticker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SHOP_CATEGORIES,
  type ShopCategoryId,
} from "@/lib/product-search";
import { useShopCategory } from "@/lib/shop-nav";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const { active, select } = useShopCategory();

  return (
    <div className="kb-deck relative z-10 mb-8">
      <div className="kb-ghost" aria-hidden="true">
        {["Tab", "Q", "W", "E", "R", "T", "Y", "U"].map((k, i) => (
          <span
            key={k}
            className={`kb-key kb-key-sm kb-ghost-key${i === 2 || i === 5 ? " kb-teal" : i === 6 ? " kb-orange" : " kb-brown"}`}
          >
            <span className="kb-cap">{k}</span>
          </span>
        ))}
      </div>
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-3">
          {SHOP_CATEGORIES.map((c) => (
            <CategoryButton
              key={c.id}
              label={c.label}
              active={active === c.id}
              onClick={() => select(c.id)}
            />
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <ButtonCarousel
          category={active}
          onSelect={select}
        />
      </div>
      <BrandTicker />
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className={cn("kb-key", className)}
    >
      <span className="kb-cap">
        {label === "All products"
          ? "All"
          : label === "Desktops"
            ? "Dsktp"
            : label === "Laptops"
              ? "Lptp"
              : label === "Components"
                ? "Cmpnt"
                : label}
      </span>
    </button>
  );
}

function ButtonCarousel({
  category,
  onSelect,
}: {
  category?: ShopCategoryId;
  onSelect: (id: ShopCategoryId) => void;
}) {
  const items = SHOP_CATEGORIES;
  const n = items.length;
  const [index, setIndex] = useState(n);
  const [anim, setAnim] = useState(true);
  const drag = useRef({ x: 0, active: false, dx: 0 });
  const slides = [...items, ...items, ...items];

  function go(delta: number) {
    setAnim(true);
    setIndex((i) => i + delta);
  }

  function settle() {
    if (index < n) {
      setAnim(false);
      setIndex(index + n);
    } else if (index >= n * 2) {
      setAnim(false);
      setIndex(index - n);
    }
  }

  useEffect(() => {
    if (anim) return;
    const id = requestAnimationFrame(() => setAnim(true));
    return () => cancelAnimationFrame(id);
  }, [anim, index]);

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
    if (dx > 40) go(-1);
    else if (dx < -40) go(1);
  }

  return (
    <div
      className="relative"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="overflow-hidden px-10 pb-4 pt-1">
        <div
          className={cn(
            "flex w-full",
            anim && "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{ transform: `translateX(-${index * 50}%)` }}
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            settle();
          }}
        >
          {slides.map((item, i) => (
            <div key={`${item.id}-${i}`} className="shrink-0 basis-1/2 px-1.5">
              <CategoryButton
                label={item.label}
                active={category === item.id}
                onClick={() => onSelect(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => go(-1)}
        className="absolute left-0 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next categories"
        onClick={() => go(1)}
        className="absolute right-0 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/90"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
