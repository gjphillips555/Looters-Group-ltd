import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import type { BranchId } from "@/data/catalog";
import { SiftaLootChip } from "@/components/sifta-loot-chip";
import { ResponsiveImage } from "@/components/responsive-image";

const LOGO = "/brand/logos/computas.png";

export function SiteHeader(_props: { branch?: BranchId }) {
  const { isPending } = useCurrentUserState();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur-md">
      <div className="site-header-bar mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 min-w-0 items-center gap-3">
          <ResponsiveImage
            src={LOGO}
            alt="Looters Computas"
            width={140}
            height={45}
            sizes="120px"
            quality={75}
            priority
            className="h-8 w-auto object-contain sm:h-9"
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
            className="hidden min-h-11 items-center rounded-full px-3 text-sm font-semibold text-ink hover:bg-line/70 sm:inline-flex"
          >
            Policy
          </Link>
          {isPending ? (
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-line" aria-hidden />
          ) : (
            <>
              <SignedOut>
                <Link
                  to="/login"
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-ink hover:bg-line/70"
                >
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <SiftaLootChip />
                <UserButton />
              </SignedIn>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="cv-auto relative mt-auto overflow-hidden border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <ResponsiveImage
            src={LOGO}
            alt="Looters Computas"
            width={160}
            height={51}
            sizes="140px"
            quality={70}
            className="h-10 w-auto object-contain"
          />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Looters Computas — refurbished computers online. The shopfront closed
            after a few years; we now work from home thanks to the internet taking
            over the high street.
          </p>
          <p className="mt-3 text-sm text-muted">Wellington, New Zealand</p>
          <ResponsiveImage
            src="/brand/logos/afterpay.png"
            alt="Afterpay"
            width={120}
            height={48}
            sizes="100px"
            quality={70}
            className="mt-4 h-9 w-auto object-contain"
          />
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Shop
            </p>
            <Link to="/computas/shop" className="block hover:underline">
              Live listings
            </Link>
            <Link to="/computas/policy" className="block hover:underline">
              Store policy
            </Link>
            <Link to="/computas/news" className="block hover:underline">
              Hardware news
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Account
            </p>
            <Link to="/login" className="block hover:underline">
              Sign in
            </Link>
            <Link to="/staff/login" className="block hover:underline">
              Staff
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        © 2026 Looters Computas
      </div>
    </footer>
  );
}

export function BranchShell({
  children,
}: {
  branch?: BranchId;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-ink">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
