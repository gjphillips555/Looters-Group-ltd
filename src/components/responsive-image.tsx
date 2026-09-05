import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/** Widths Vercel Image Optimization will serve (keep in sync with vercel.json). */
const WIDTHS = [64, 96, 128, 256, 320, 480, 640, 750, 828, 1080, 1200, 1920] as const;

function isRemoteHttp(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function isLocalPublic(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

function vercelImageUrl(src: string, width: number, quality = 75): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
  });
  return `/_vercel/image?${params.toString()}`;
}

/** Few well-chosen widths instead of the full ladder — less srcset noise. */
function pickWidths(displayMax: number): number[] {
  const targets = [
    Math.min(displayMax, 320),
    displayMax,
    Math.min(displayMax * 2, 1920),
  ];
  const set = new Set<number>();
  for (const t of targets) {
    const match = WIDTHS.find((w) => w >= t) ?? WIDTHS[WIDTHS.length - 1];
    set.add(match);
  }
  return [...set].sort((a, b) => a - b);
}

export type ResponsiveImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  /** Eager + high fetch priority for LCP heroes */
  priority?: boolean;
  /** Disable Vercel optimizer (plain src only) */
  plain?: boolean;
  quality?: number;
  /** Fallback if primary src fails to load */
  onErrorSrc?: string;
} & Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "width" | "height" | "sizes" | "srcSet" | "loading" | "fetchPriority"
>;

/**
 * Responsive image: lazy by default, async decode, Vercel Image Optimization
 * srcset for local public assets and allowed remote domains.
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
  quality = 72,
  onErrorSrc,
  onError,
  ...rest
}: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false);
  const activeSrc = failed && onErrorSrc ? onErrorSrc : src;
  const canOptimize = !plain && (isLocalPublic(activeSrc) || isRemoteHttp(activeSrc));

  const { srcSet, resolvedSrc } = useMemo(() => {
    if (!canOptimize) {
      return { srcSet: undefined as string | undefined, resolvedSrc: activeSrc };
    }
    const widths = pickWidths(width);
    const srcSet = widths.map((w) => `${vercelImageUrl(activeSrc, w, quality)} ${w}w`).join(", ");
    const fallbackW = widths.find((w) => w >= width) ?? widths[widths.length - 1];
    return {
      srcSet,
      resolvedSrc: vercelImageUrl(activeSrc, fallbackW, quality),
    };
  }, [canOptimize, activeSrc, width, quality]);

  return (
    <img
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={cn(className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      onError={(e) => {
        if (onErrorSrc && !failed) setFailed(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
