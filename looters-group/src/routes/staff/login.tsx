import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useStaff } from "@/lib/staff";
import { getStaffStatus } from "@/lib/staff-access";

export const Route = createFileRoute("/staff/login")({ component: StaffLogin });

function StaffLogin() {
  const nav = useNavigate();
  const { signedIn, ready, hydrate, login } = useStaff();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (ready && signedIn) nav({ to: "/staff" });
  }, [ready, signedIn, nav]);

  useEffect(() => {
    void getStaffStatus()
      .then((s) => {
        if (s.staff) nav({ to: "/staff" });
      })
      .catch(() => undefined);
  }, [nav]);

  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4 text-cream">
      <div className="w-full max-w-sm rounded-3xl border border-cream/10 bg-cream/[0.04] p-8">
        <p className="mb-5 font-display text-lg font-extrabold">Looters Group Ltd</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
          Staff
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Looters Hub</h1>
        <p className="mt-2 text-sm text-cream/60">
          Sign in with Google, X or GitHub. New staff must be granted access by
          the owner from the email they receive — nobody else can approve it.
        </p>

        <div className="mt-6 space-y-2">
          {authEnabled
            ? GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/staff" })}
                  className="flex min-h-11 w-full items-center justify-center rounded-full bg-cream text-sm font-semibold text-ink"
                >
                  Continue with {p.label}
                </button>
              ))
            : null}
        </div>

        <p className="mt-4 text-center text-sm text-cream/60">
          <Link to="/staff/apply" className="underline">
            Request staff access
          </Link>
        </p>

        <form
          className="mt-8 border-t border-cream/10 pt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const ok = login(user, pass);
            setErr(!ok);
            if (ok) nav({ to: "/staff" });
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/40">
            Owner desk
          </p>
          <input
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username"
            className="mt-3 min-h-11 w-full rounded-xl border border-cream/15 bg-ink px-3 text-sm text-cream"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="mt-2 min-h-11 w-full rounded-xl border border-cream/15 bg-ink px-3 text-sm text-cream"
          />
          {err ? (
            <p className="mt-3 text-sm text-computas-hot">Those details are not right.</p>
          ) : null}
          <button
            type="submit"
            className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full border border-cream/20 text-sm font-semibold"
          >
            Owner sign in
          </button>
        </form>
      </div>
    </main>
  );
}
