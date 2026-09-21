import { cn } from "@/lib/utils";

export function AfterpayMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 92 22"
      className={cn("inline-block h-4 w-auto shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="92" height="22" rx="4" fill="#b2fce4" />
      <text
        x="46"
        y="15.5"
        textAnchor="middle"
        fill="#111"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11.5"
        fontWeight="700"
      >
        afterpay
      </text>
    </svg>
  );
}

export function AfterpayLine({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  const each = Math.round((amount / 4) * 100) / 100;
  if (each <= 0) return null;
  const label = new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(each);

  return (
    <p className={cn("flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <AfterpayMark />
      <span>
        Pay 4 instalments of <span className="font-semibold text-foreground">{label}</span>
      </span>
    </p>
  );
}
