import { Link } from "@tanstack/react-router";
import { SKU_LABELS, type BranchId, type SkuCode } from "@/data/catalog";
import { cn } from "@/lib/utils";

const TONE: Record<SkuCode, string> = {
  DSKTP: "bg-computas text-cream",
  LPTOP: "bg-computas-hot text-cream",
  CMPNT: "bg-ink text-cream",
  APARL: "bg-apparel text-cream",
  SFTWR: "bg-software text-cream",
};

export function SkuStamp({
  sku,
  className,
}: {
  sku: SkuCode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-[0.18em]",
        TONE[sku],
        className,
      )}
    >
      {sku}
    </span>
  );
}

export function SkuKey({ branch }: { branch?: BranchId }) {
  const rows = branch ? SKU_LABELS.filter((s) => s.branch === branch) : SKU_LABELS;
  return (
    <div className="flex flex-wrap gap-2">
      {rows.map((s) => {
        const href =
          s.branch === "computas"
            ? "/computas/shop"
            : s.branch === "apparel"
              ? "/apparel"
              : "/software";
        return (
          <Link
            key={s.code}
            to={href}
            className="inline-flex items-center gap-2 rounded-full bg-cream px-2 py-1 shadow-border"
            title={s.hint}
          >
            <SkuStamp sku={s.code} />
            <span className="pr-1 text-xs font-medium text-muted">{s.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
