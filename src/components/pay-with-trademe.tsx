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
      className={cn("kb-key kb-trademe kb-spacebar w-full", className)}
    >
      <span className="kb-cap">
        <span>Pay with:</span>
        <img
          src={ARTWORK.trademe}
          alt="Trade Me"
          width={418}
          height={56}
          className="h-6 w-auto max-w-[11rem] object-contain object-left"
        />
      </span>
    </a>
  );
}