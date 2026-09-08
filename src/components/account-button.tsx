import { useState, useSyncExternalStore } from "react";
import { GoogleMark } from "@/components/google-mark";
import { authEnabled, signIn, signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const subscribeToNothing = () => () => {};
const noGateSessionOnServer = () => false;

export function AccountButton() {
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
        className="kb-key kb-key-sm"
      >
        <span className="kb-cap">
          <GoogleMark className="size-5" />
        </span>
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
        className="kb-key kb-key-sm"
      >
        <span className="kb-cap overflow-hidden p-0">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">{label.charAt(0).toUpperCase()}</span>
          )}
        </span>
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
