import { ARTWORK } from "@/lib/artwork";

export function BrandLogo({
  className = "h-12 w-auto max-w-[220px] object-contain sm:h-14 sm:max-w-[280px]",
}: {
  className?: string;
}) {
  return (
    <img
      src={ARTWORK.logoDark}
      alt="Looters Computas"
      className={className}
    />
  );
}
