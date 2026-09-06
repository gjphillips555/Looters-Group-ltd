import { LOGO_COMPUTAS } from "@/lib/store-logo-computas";

/** Footer stamp for software catalog cards and related tools. */
export function ProductOfComputas({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mt-3 flex flex-col items-center gap-1 border-t border-line/80 pt-3 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        This is a product of:
      </p>
      <img
        src={LOGO_COMPUTAS.src}
        alt="Looters Computas"
        className="h-7 w-auto max-w-[9rem] object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
