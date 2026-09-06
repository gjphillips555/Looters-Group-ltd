import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LOGO_APPAREL, LOGO_COMPUTAS, LOGO_GROUPLTD, LOGO_SOFTWARE } from "@/lib/store-logos";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { authEnabled, signIn } from "@/lib/auth/client";

type HeaderBrand = {
  src: string;
  alt: string;
  href: string;
};

function brandForPath(pathname: string): HeaderBrand {
  if (pathname.startsWith("/software")) {
    return { src: LOGO_SOFTWARE.src, alt: "Looters Software", href: "/software" };
  }
  if (pathname.startsWith("/apparel")) {
    return { src: LOGO_APPAREL.src, alt: "Looters Apparel", href: "/apparel" };
  }
  if (pathname.startsWith("/computas")) {
    return { src: LOGO_COMPUTAS.src, alt: "Looters Computas", href: "/computas" };
  }
  return { src: LOGO_GROUPLTD.src, alt: "Looters Group Ltd", href: "/" };
}

const GAMING_ADS = [
  {
    id: "amd",
    brand: "AMD",
    line: "Ryzen gaming CPUs in stock · rebuilds ready",
    href: "/computas/shop",
    tone: "bg-[#000000] text-white",
    chip: "AMD",
  },
  {
    id: "intel",
    brand: "Intel",
    line: "Core Ultra / 14th-gen builds · tested towers",
    href: "/computas/shop",
    tone: "bg-[#0071c5] text-white",
    chip: "Intel",
  },
  {
    id: "nvidia",
    brand: "NVIDIA",
    line: "GeForce RTX cards · 40-series & last-gen value",
    href: "/computas/shop",
    tone: "bg-[#76b900] text-ink",
    chip: "NVIDIA",
  },
  {
    id: "sapphire",
    brand: "Sapphire",
    line: "Radeon GPUs · Pulse & Nitro+ boards",
    href: "/computas/shop",
    tone: "bg-[#1a1a2e] text-white",
    chip: "Sapphire",
  },
] as const;

function HeaderAd() {
  const [index, setIndex] = useState(0);
  const ad = GAMING_ADS[index]!;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % GAMING_ADS.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Link
      to={ad.href}
      className={`group flex min-h-9 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full px-3 py-1.5 text-center shadow-sm transition hover:opacity-95 sm:min-h-10 sm:gap-3 sm:px-4 ${ad.tone}`}
      aria-label={`${ad.brand} advert — ${ad.line}`}
    >
      <span className="shrink-0 rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide sm:text-[11px]">
        {ad.chip}
      </span>
      <span className="min-w-0 truncate text-[11px] font-semibold leading-tight sm:text-xs">
        <span className="sm:hidden">{ad.brand} · shop PC gear</span>
        <span className="hidden sm:inline">{ad.line}</span>
      </span>
      <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-wider opacity-80 md:inline">
        Shop →
      </span>
    </Link>
  );
}

function HeaderAuth() {
  if (!authEnabled) {
    return <UserButton />;
  }

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <button
          type="button"
          onClick={() => void signIn("grok-google", { callbackURL: window.location.pathname })}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-3 text-sm font-semibold text-ink shadow-sm hover:bg-line/40"
          aria-label="Sign in with Google"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="hidden sm:inline">Sign in</span>
        </button>
      </SignedOut>
    </>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const brand = useMemo(() => brandForPath(pathname), [pathname]);

  return (
    <header className="site-header-bar sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
        {/* Left — current section logo */}
        <Link to={brand.href} className="flex min-h-10 min-w-0 shrink-0 items-center">
          <img
            src={brand.src}
            alt={brand.alt}
            className="h-8 w-auto max-w-[7.5rem] object-contain sm:h-9 sm:max-w-[11rem]"
          />
        </Link>

        {/* Centre — PC gaming advert */}
        <div className="flex min-w-0 flex-1 justify-center px-1">
          <HeaderAd />
        </div>

        {/* Right — nav + auth */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
            <Link
              to="/computas/shop"
              className="inline-flex min-h-10 items-center rounded-full px-2.5 text-sm font-semibold text-ink hover:bg-line/70"
            >
              Shop
            </Link>
            <Link
              to="/software"
              className="inline-flex min-h-10 items-center rounded-full px-2.5 text-sm font-semibold text-ink hover:bg-line/70"
            >
              Software
            </Link>
            <Link
              to="/computas/policy"
              className="inline-flex min-h-10 items-center rounded-full px-2.5 text-sm font-semibold text-ink hover:bg-line/70"
            >
              Policy
            </Link>
          </nav>
          <HeaderAuth />
        </div>
      </div>

      {/* Mobile nav row — clean secondary bar */}
      <nav
        className="flex items-center justify-center gap-1 border-t border-line/60 px-2 py-1 md:hidden"
        aria-label="Mobile"
      >
        <Link
          to="/computas/shop"
          className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg text-xs font-semibold text-ink hover:bg-line/50"
        >
          Shop
        </Link>
        <Link
          to="/software"
          className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg text-xs font-semibold text-ink hover:bg-line/50"
        >
          Software
        </Link>
        <Link
          to="/computas/policy"
          className="inline-flex min-h-9 flex-1 items-center justify-center rounded-lg text-xs font-semibold text-ink hover:bg-line/50"
        >
          Policy
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
        <img
          src={LOGO_GROUPLTD.src}
          alt="Looters Group Ltd"
          className="mx-auto h-8 w-auto object-contain"
        />
        <p className="mt-3 text-sm text-muted">
          Refurbished PCs online · Wellington · Shop closed, selling from home
        </p>
        <p className="mt-4 text-xs text-muted">© 2026 Looters Group Ltd</p>
      </div>
    </footer>
  );
}

export function BranchShell({
  children,
  branch: _branch,
}: {
  children: ReactNode;
  branch?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-ink">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
