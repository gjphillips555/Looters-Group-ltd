import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import type { BranchId } from "@/data/catalog";
import { BRANCHES, SIFTA } from "@/data/catalog";
import { BrandLogo, LootersMark } from "@/components/brand-logo";
import { BranchMenu } from "@/components/branch-menu";
import { CryptoTicker } from "@/components/crypto-ticker";
import { AfterpayMark } from "@/components/afterpay-mark";
import { SiftaLootChip } from "@/components/sifta-loot-chip";

export function SiteHeader({ branch }: { branch?: BranchId }) {
  const { isPending } = useCurrentUserState();
  const isGroup = !branch;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/95 backdrop-blur-md">
      <div className="site-header-bar mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 min-w-0 items-center gap-3">
          {isGroup ? (
            <span className="flex min-w-0 items-center gap-3">
              <LootersMark className="h-8 w-auto object-contain sm:h-10" />
              <span className="hidden text-[11px] uppercase tracking-[0.16em] text-muted sm:block">
                Group Ltd · A Purple Penguin Company
              </span>
            </span>
          ) : (
            <>
              <BrandLogo branch={branch} />
              <span className="hidden text-[11px] uppercase tracking-[0.16em] text-muted sm:block">
                Back to group
              </span>
            </>
          )}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <BranchMenu branch={branch} />
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
        </div>
      </div>
      <CryptoTicker />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="cv-auto mt-auto border-t border-line bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div>
          <LootersMark className="h-8 w-auto object-contain" />
          <p className="mt-2 font-display text-lg font-extrabold">Looters Group Ltd</p>
          <p className="mt-1 max-w-xs text-sm text-muted">
            A Purple Penguin Company. Nothing useful goes to waste — gear and
            clothes get a second life instead of landfill.
          </p>
          <p className="mt-3 text-sm text-muted">
            6 Ruru Avenue
            <br />
            Kilbirnie, Wellington 6022
          </p>
          <div className="mt-4">
            <AfterpayMark className="h-16 w-auto" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Branches
            </p>
            {BRANCHES.map((b) => (
              <Link
                key={b.id}
                to={b.href as "/computas" | "/apparel" | "/software"}
                className="block hover:underline"
              >
                {b.name}
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Visit
            </p>
            <Link to="/computas/policy" className="block hover:underline">
              Store policy
            </Link>
            <Link to="/computas/news" className="block hover:underline">
              Hardware news
            </Link>
            <Link to="/login" className="block hover:underline">
              Account
            </Link>
            <a
              href={SIFTA.url}
              target="_blank"
              rel="noreferrer"
              className="block hover:underline"
            >
              Sifta Browser
            </a>
            <Link to="/staff/login" className="block hover:underline">
              Staff
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        © 2026 Looters Group Ltd · A Purple Penguin Company
      </div>
    </footer>
  );
}

export function BranchShell({
  branch,
  children,
}: {
  branch?: BranchId;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <SiteHeader branch={branch} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
