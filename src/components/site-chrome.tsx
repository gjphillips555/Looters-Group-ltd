import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ResponsiveImage } from "@/components/responsive-image";

/**
 * Site wordmark only.
 * Prefer /brand/logos/title.png (Title.png from brand pack).
 * Falls back to computas.png if title.png is not deployed yet.
 */
const TITLE = "/brand/logos/title.png";
const TITLE_FALLBACK = "/brand/logos/computas.png";

function TitleLogo({
  className,
  width,
  height,
  sizes,
  priority,
}: {
  className?: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <ResponsiveImage
      src={TITLE}
      alt="Looters Computas"
      width={width}
      height={height}
      sizes={sizes}
      quality={85}
      priority={priority}
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes("title.png")) {
          img.src = TITLE_FALLBACK;
        }
      }}
    />
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 min-w-0 items-center">
          <TitleLogo
            width={200}
            height={64}
            sizes="140px"
            priority
            className="h-9 w-auto max-w-[11rem] object-contain sm:h-10"
          />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/computas/shop"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-ink hover:bg-line/70"
          >
            Shop
          </Link>
          <Link
            to="/computas/policy"
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-ink hover:bg-line/70"
          >
            Policy
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <TitleLogo
          width={160}
          height={51}
          sizes="120px"
          className="mx-auto h-8 w-auto object-contain"
        />
        <p className="mt-3 text-sm text-muted">
          Refurbished PCs online · Wellington · Shop closed, selling from home
        </p>
        <p className="mt-4 text-xs text-muted">© 2026 Looters Computas</p>
      </div>
    </footer>
  );
}

export function BranchShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-ink">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
