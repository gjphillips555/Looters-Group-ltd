import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <BranchShell>
      <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
        <div className="w-full rounded-3xl bg-cream p-8 shadow-border">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Google, X or GitHub. Your avatar and SiftaLoot balance show top right.
            The wallet works here — Sifta Browser not required.
          </p>
          <div className="mt-6 space-y-2">
            {authEnabled ? (
              GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-cream hover:opacity-90"
                >
                  Continue with {p.label}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted">Sign-in is disabled.</p>
            )}
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
