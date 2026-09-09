import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useOledMode } from "@/lib/oled-mode";
import { SHOP_CATEGORIES } from "@/lib/product-search";
import { CYCLE_LABEL, useShopCategory } from "@/lib/shop-nav";
import { cn } from "@/lib/utils";

const DETENT = Math.PI / 3;

export function CategoryDial({ className }: { className?: string }) {
  const { active, cycle } = useShopCategory();
  const help = useOledMode((s) => s.help);
  const cycleHelp = useOledMode((s) => s.cycleHelp);
  const showFlash = useOledMode((s) => s.showFlash);
  const rot = useRef(0);
  const last = useRef(0);
  const acc = useRef(0);
  const dragging = useRef(false);
  const moved = useRef(false);
  const el = useRef<HTMLButtonElement>(null);

  function setRot(deg: number) {
    rot.current = deg;
    el.current?.style.setProperty("--as-rot", `${deg}deg`);
  }

  function angleOf(e: ReactPointerEvent) {
    const r = el.current!.getBoundingClientRect();
    return Math.atan2(
      e.clientY - (r.top + r.height / 2),
      e.clientX - (r.left + r.width / 2),
    );
  }

  function step(delta: 1 | -1) {
    if (help) {
      cycleHelp(delta);
      return;
    }
    const n = SHOP_CATEGORIES.length;
    const i = SHOP_CATEGORIES.findIndex((c) => c.id === active);
    const next = SHOP_CATEGORIES[(i + delta + n) % n];
    showFlash(CYCLE_LABEL[next.id]);
    cycle(delta);
  }

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    moved.current = false;
    last.current = angleOf(e);
    acc.current = 0;
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return;
    const a = angleOf(e);
    let delta = a - last.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    if (Math.abs(delta) > 0.02) moved.current = true;
    last.current = a;
    setRot(rot.current + (delta * 180) / Math.PI);
    acc.current += delta;
    if (acc.current > DETENT) {
      step(1);
      acc.current = 0;
    } else if (acc.current < -DETENT) {
      step(-1);
      acc.current = 0;
    }
  }

  function onPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (!moved.current) step(1);
  }

  const label = help
    ? "Help pages"
    : (SHOP_CATEGORIES.find((c) => c.id === active)?.label ?? "All");

  return (
    <button
      ref={el}
      type="button"
      className={cn("as-dial", className)}
      aria-label={`OLED dial, ${label}. Spin or tap to change.`}
      title={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <span className="as-dial-ring" aria-hidden="true" />
      <span className="as-dial-face" aria-hidden="true" />
      <span className="dial-hint" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="dial-hint-svg">
          <circle cx="32" cy="32" r="30" fill="#041018" />
          <path
            d="M44.5 22.5c6 4.2 9 12.2 6.2 19.4-3.2 8.2-12.4 12.8-21 10.6"
            fill="none"
            stroke="#7ad7e8"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path d="M46 16.5 48 28 36.5 26z" fill="#7ad7e8" />
        </svg>
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
