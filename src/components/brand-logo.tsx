import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { BranchId } from "@/data/catalog";

export const BRANCH_LOGO: Record<BranchId, string> = {
  computas: "/brand/logos/computas.png",
  apparel: "/brand/logos/apparel.png",
  software: "/brand/logos/software.png",
};

export const GROUP_LOGO = "/brand/logos/looters.png";
const GROUP_GIF = "/brand/logos/looters.gif";
const GROUP_STILL = "/brand/logos/looters-still.png";

/** Animated wordmark plays through once, then holds the last frame. */
export function LootersMarkOnce({ className }: { className?: string }) {
  const [src, setSrc] = useState(GROUP_GIF);
  useEffect(() => {
    const t = window.setTimeout(() => setSrc(GROUP_STILL), 10050);
    return () => window.clearTimeout(t);
  }, []);
  return <img src={src} alt="Looters" className={className} />;
}

export function LootersMark({ className }: { className?: string }) {
  return <img src={GROUP_LOGO} alt="Looters" className={className} />;
}

export function BrandLogo({
  branch,
  className,
  imgClassName,
}: {
  branch: BranchId;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-white px-2 py-1 shadow-border",
        className,
      )}
    >
      <img
        src={BRANCH_LOGO[branch]}
        alt=""
        className={cn("h-10 w-auto object-contain sm:h-12", imgClassName)}
      />
    </span>
  );
}
