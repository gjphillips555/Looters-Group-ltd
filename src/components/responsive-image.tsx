import { useMemo } from "react";
import { cn } from "@/lib/utils";

/** Widths Vercel Image Optimization will serve (keep in sync with vercel.json). */
const WIDTHS = [320, 480, 640, 750, 828, 1080, 1200, 1920] as const;

function isRemoteHttp(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function isLocalPublic(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

/** Build a Vercel optimized URL when running on Vercel (works for local public + allowed remote). */
function vercelImageUrl(src: string, width: number, quality = 75): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
  });
  return `/_vercel/image?${params.toString()}`;
}

function pickWidths(displayMax: number): number[] {
  const needed = WIDTHS.filter((w) => w <= displayMax * 1.5 || w <= 640);
  const set = new Set<number>(needed.length ? needed : [WIDTHS[0]]);
  // Always include nearest at/above displayMax for sharp retina
  const above = WIDTHS.find((w) => w >= displayMax);
  if (above) set.add(above);
  const retina = WIDTHS.find((w) => w >= displayMax * 2);
  if (retina) set.add(retina);
  return [...set].sort((a, b) => a - b);
}

export type ResponsiveImageProps = {
  src: string;
  alt: string;
  /** Intrinsic / layout width hint (CSS pixels) */
  width?: number;
  /** Intrinsic / layout height hint */
  height?: number;
  /** CSS sizes attribute, e.g. "(max-width: 640px) 100vw, 400px" */
  sizes?: string;
  className?: string;
  /** Eager + high fetch priority for LCP heroes */
  priority?: boolean;
  /** Disable Vercel optimizer (plain src only) */
  plain?: boolean;
  quality?: number;
} & Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "sizes" | "srcSet" | "loading" | "fetchPriority"
>;

/**
 * Responsive image: lazy by default, async decode, optional Vercel Image
 * Optimization srcset for local public assets and allowed remote domains.
 */
export function ResponsiveImage({
  src,
  alt,
  width = 800,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
  className,
  priority = false,
  plain = false,
  quality = 75,
  ...rest
}: ResponsiveImageProps) {
  const canOptimize = !plain && (isLocalPublic(src) || isRemoteHttp(src));

  const { srcSet, resolvedSrc } = useMemo(() => {
    if (!canOptimize) {
      return { srcSet: undefined as string | undefined, resolvedSrc: src };
    }
    const widths = pickWidths(width);
    const srcSet = widths.map((w) => `${vercelImageUrl(src, w, quality)} ${w}w`).join(", ");
    const fallbackW = widths.find((w) => w >= width) ?? widths[widths.length - 1];
    return {
      srcSet,
      resolvedSrc: vercelImageUrl(src, fallbackW, quality),
    };
  }, [canOptimize, src, width, quality]);

  return (
    <img
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={cn("media", className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      {...rest}
    />
  );
}
