import { ARTWORK } from "@/lib/artwork";
import { useTheme } from "@/lib/theme";

export function BrandLogo({
  className = "h-12 w-auto max-w-[220px] object-contain sm:h-14 sm:max-w-[280px]",
}: {
  className?: string;
}) {
  const { theme } = useTheme();
  const src = theme === "light" ? ARTWORK.logoLight : ARTWORK.logoDark;

  return (
    <img
      src={src}
      alt="Looters Computas"
      className={className}
    />
  );
}
