import { cn } from "@/lib/utils";
import type { BranchId } from "@/data/catalog";

export const BRANCH_LOGO: Record<BranchId, string> = {
  computas: "/brand/logos/logo_purple.png",
  apparel: "/brand/logos/apparels.png",
  software: "/brand/logos/software.png",
};

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
