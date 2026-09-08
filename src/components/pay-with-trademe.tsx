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
        "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md bg-trademe px-4 text-sm font-semibold text-trademe-foreground transition-opacity hover:opacity-90 sm:w-auto",
        className,
      )}
    >
      <span>Pay with:</span>
      <img
        src={ARTWORK.trademe}
        alt="Trade Me"
        width={418}
        height={56}
        className="h-6 w-auto"
      />
    </a>
  );
}
