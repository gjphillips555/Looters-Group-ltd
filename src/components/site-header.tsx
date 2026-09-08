import { useState, useSyncExternalStore } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import { BrandLogo } from "@/components/brand-logo";
import { GoogleMark } from "@/components/google-mark";
import { ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCartTotals } from "@/lib/cart-store";
import { SITE_DOMAIN } from "@/lib/site";
import { authEnabled, signIn, signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCartTotals();

  return (
    <header className="sticky top-0 z-30 overflow-visible">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 border-b border-border bg-background/85 backdrop-blur" />
        <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 flex-col items-start gap-0.5 md:hidden"
            aria-label="Looters Computas home"
          >
            <BrandLogo className="h-12 w-auto max-w-[200px] object-contain" />
            <span className="pl-0.5 text-[10px] font-medium leading-none tracking-wide text-muted-foreground">
              {SITE_DOMAIN}
            </span>
          </Link>
          <Link
            to="/"
            className="relative z-40 hidden h-16 w-[260px] shrink-0 md:block"
            aria-label="Looters Computas home"
          >
            <BrandLogo className="absolute left-0 top-0 h-[6.75rem] w-auto max-w-[280px] object-contain object-left-top drop-shadow-[0_8px_16px_rgba(0,0,0,0.28)]" />
            <span className="absolute left-1 top-[6.9rem] text-[11px] font-medium leading-none tracking-wide text-muted-foreground">
              {SITE_DOMAIN}
            </span>
          </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ShopSearch className="hidden w-[200px] shrink-0 md:block lg:w-[240px]" />
          <ThemeToggle />
          <HeaderAccount />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative inline-flex h-11 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <ShoppingCart className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>
        </div>
      </div>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

const subscribeToNothing = () => () => {};
const noGateSessionOnServer = () => false;

function HeaderAccount() {
  const { user, isPending } = useCurrentUserState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const gateSession = useSyncExternalStore(
    subscribeToNothing,
    hasGateSessionMarker,
    noGateSessionOnServer,
  );

  if (isPending) {
    return (
      <div
        className="size-11 shrink-0 animate-pulse rounded-full bg-secondary"
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signIn("grok-google", { callbackURL: "/" })}
        aria-label="Sign in with Google (optional)"
        className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-white transition-opacity hover:opacity-90"
      >
        <GoogleMark className="size-5" />
      </button>
    );
  }

  const label = user.displayName ?? user.primaryEmail ?? "Account";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={`${label} account`}
        className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-secondary"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="size-11 object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">{label.charAt(0).toUpperCase()}</span>
        )}
      </button>
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close account menu"
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-border bg-card p-3 shadow-xl">
            <p className="truncate text-sm font-medium">{label}</p>
            {user.primaryEmail && (
              <p className="truncate text-xs text-muted-foreground">
                {user.primaryEmail}
              </p>
            )}
            {authEnabled && !gateSession && (
              <button
                type="button"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  void signOut().catch(() => setSigningOut(false));
                }}
                className="mt-3 h-9 w-full rounded-md border border-border text-sm hover:bg-secondary disabled:opacity-60"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
