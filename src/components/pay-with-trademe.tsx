import { ARTWORK } from "@/lib/artwork";
import { cn } from "@/lib/utils";

export function PayWithTradeMe({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-md border border-black/10 bg-trademe px-4 text-sm font-semibold text-trademe-foreground transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span>Pay with:</span>
      <img
        src={ARTWORK.trademe}
        alt="Trade Me"
        width={418}
        height={56}
        className="h-6 w-auto max-w-[11rem] object-contain object-left"
      />
    </a>
  );
}
