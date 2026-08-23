import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { getAuthHealth } from "@/lib/auth/health";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/login")({ component: Login });

type Health = {
  database: boolean;
  google: boolean;
  github: boolean;
  x: boolean;
};

function ready(health: Health | null, idp: string): boolean {
  if (!health) return true;
  if (!health.database) return false;
  if (idp === "google") return health.google;
  if (idp === "github") return health.github;
  if (idp === "twitter") return health.x;
  return false;
}

function Login() {
  const [health, setHealth] = useState<Health | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getAuthHealth().then(setHealth).catch(() => undefined);
  }, []);

  async function social(providerId: string) {
    setErr(null);
    try {
      await signIn(providerId, { callbackURL: "/" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
    }
  }

  async function emailSignIn() {
    setErr(null);
    setBusy(true);
    try {
      const { error } = await authClient.signIn.email({ email, password, callbackURL: "/" });
      if (error) throw new Error(error.message ?? "Sign-in failed");
      window.location.href = "/";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function emailSignUp() {
    setErr(null);
    setBusy(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0] || "Looter",
        callbackURL: "/",
      });
      if (error) throw new Error(error.message ?? "Sign-up failed");
      window.location.href = "/";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <BranchShell>
      <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
        <div className="w-full rounded-3xl bg-cream p-8 shadow-border">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Google, X, GitHub, or email. Avatar and SiftaLoot sit top right.
          </p>
          {health && !health.database ? (
            <p className="mt-4 rounded-2xl bg-line px-3 py-2 text-xs leading-relaxed text-ink">
              Live sign-in needs a free Neon database. In Vercel → Settings →
              Environment Variables add <span className="font-mono">DATABASE_URL</span>{" "}
              from neon.tech (GitHub login, copy the connection string), then
              Redeploy. Then add Google / GitHub / X app keys.
            </p>
          ) : null}
          {err ? <p className="mt-4 text-sm text-computas">{err}</p> : null}
          <div className="mt-6 space-y-2">
            {authEnabled ? (
              GROK_PROVIDERS.map((p) => {
                const on = ready(health, p.idp);
                return (
                  <button
                    key={p.providerId}
                    type="button"
                    disabled={!on}
                    onClick={() => void social(p.providerId)}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-40"
                  >
                    Continue with {p.label}
                    {!on ? <span className="text-[10px] font-medium">needs setup</span> : null}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-muted">Sign-in is disabled.</p>
            )}
          </div>
          <div className="mt-6 space-y-2 border-t border-line pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Email
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (8+ characters)"
              className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy || (health ? !health.database : false)}
                onClick={() => void emailSignIn()}
                className="min-h-11 flex-1 rounded-full bg-ink text-sm font-semibold text-cream disabled:opacity-40"
              >
                Sign in
              </button>
              <button
                type="button"
                disabled={busy || (health ? !health.database : false)}
                onClick={() => void emailSignUp()}
                className="min-h-11 flex-1 rounded-full bg-line text-sm font-semibold disabled:opacity-40"
              >
                Create account
              </button>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted">
            Staff? Sign in first, then{" "}
            <Link to="/staff/apply" className="font-semibold underline">
              request staff access
            </Link>
            .
          </p>
          <Link to="/" className="mt-4 inline-block text-sm text-muted hover:underline">
            Back to Looters
          </Link>
        </div>
      </main>
    </BranchShell>
  );
}
