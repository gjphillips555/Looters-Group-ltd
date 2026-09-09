import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { SHOP_CATEGORIES } from "@/lib/product-search";
import { useShopCategory } from "@/lib/shop-nav";
import { cn } from "@/lib/utils";

const DETENT = Math.PI / 3;

export function CategoryDial({ className }: { className?: string }) {
  const { active, cycle } = useShopCategory();
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
      cycle(1);
      acc.current = 0;
    } else if (acc.current < -DETENT) {
      cycle(-1);
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
    if (!moved.current) cycle(1);
  }

  const label = SHOP_CATEGORIES.find((c) => c.id === active)?.label ?? "All";

  return (
    <button
      ref={el}
      type="button"
      className={cn("as-dial", className)}
      aria-label={`Category dial, ${label}. Spin or click to change.`}
      title={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <span className="as-dial-knurl" aria-hidden="true" />
      <span className="as-dial-cap" aria-hidden="true" />
      <span className="as-dial-tick" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
