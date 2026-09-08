import { useState, useSyncExternalStore } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/cart-drawer";
import { BrandLogo } from "@/components/brand-logo";
import { GoogleMark } from "@/components/google-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { useCartTotals } from "@/lib/cart-store";
import { useProductSearch } from "@/lib/product-search";
import { authEnabled, signIn, signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCartTotals();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Looters Computas home"
        >
          <BrandLogo />
          <span className="sr-only">Looters Computas</span>
        </Link>

        <HeaderSearch />

        <div className="ml-auto flex shrink-0 items-center gap-2">
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

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

const subscribeToNothing = () => () => {};
const noGateSessionOnServer = () => false;

function HeaderSearch() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const query = useProductSearch((s) => s.query);
  const setQuery = useProductSearch((s) => s.setQuery);

  function goShop() {
    if (pathname !== "/") void navigate({ to: "/" });
  }

  return (
    <form
      className="relative hidden min-w-0 flex-1 md:block"
      onSubmit={(e) => {
        e.preventDefault();
        goShop();
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          goShop();
        }}
        placeholder="Search products"
        aria-label="Search products"
        className="h-10 bg-secondary/40 pl-9"
      />
    </form>
  );
}

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
