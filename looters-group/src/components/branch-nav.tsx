import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { BRANCHES, type BranchId } from "@/data/catalog";
import { BRANCH_LOGO } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

export function BranchNav({ branch }: { branch?: BranchId }) {
  const scroller = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const target = branch ?? "apparel";
    const el = root.querySelector(`[data-branch="${target}"]`);
    if (!(el instanceof HTMLElement)) return;
    const left = el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2;
    root.scrollLeft = Math.max(0, left);
  }, [branch]);

  return (
    <>
      <nav
        aria-label="Looters branches"
        className="mx-auto hidden max-w-6xl grid-cols-3 gap-2 px-4 pb-2 sm:px-6 md:grid"
      >
        {BRANCHES.map((b) => (
          <Link
            key={b.id}
            to={b.href as "/computas" | "/apparel" | "/software"}
            className={cn(
              "grid h-24 place-items-center rounded-2xl bg-white p-1 shadow-border transition duration-150 hover:-translate-y-0.5",
              branch === b.id && "ring-2 ring-ink",
            )}
            aria-label={b.name}
          >
            <img
              src={BRANCH_LOGO[b.id]}
              alt=""
              className="h-[88%] w-[96%] object-contain"
            />
          </Link>
        ))}
      </nav>

      <nav
        ref={scroller}
        aria-label="Looters branches"
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-[18%] pb-3 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {BRANCHES.map((b) => (
          <Link
            key={b.id}
            data-branch={b.id}
            to={b.href as "/computas" | "/apparel" | "/software"}
            className={cn(
              "grid h-[5.5rem] w-[64%] shrink-0 snap-center place-items-center rounded-2xl bg-white p-1 shadow-border",
              branch === b.id && "ring-2 ring-ink",
            )}
            aria-label={`${b.name} — swipe for other branches`}
          >
            <img
              src={BRANCH_LOGO[b.id]}
              alt=""
              className="h-[90%] w-[96%] object-contain"
            />
          </Link>
        ))}
      </nav>
    </>
  );
}
