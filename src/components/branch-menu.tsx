import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BRANCHES, type BranchId } from "@/data/catalog";
import { BRANCH_LOGO } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

export function BranchMenu({ branch }: { branch?: BranchId }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Branches"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink hover:bg-line/70"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white p-2 shadow-border-hover"
        >
          {BRANCHES.map((b) => (
            <Link
              key={b.id}
              role="menuitem"
              to={b.href as "/computas" | "/apparel" | "/software"}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-line/60",
                branch === b.id && "bg-line/80",
              )}
            >
              <span className="grid h-14 w-28 place-items-center rounded-lg bg-white">
                <img src={BRANCH_LOGO[b.id]} alt="" className="max-h-12 max-w-[6.5rem] object-contain" />
              </span>
              <span className="text-sm font-semibold">{b.name}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
