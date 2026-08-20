import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { grantStaffAccess, peekStaffRequest } from "@/lib/staff-access";

type Search = { token: string };

export const Route = createFileRoute("/staff/approve")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    token: typeof raw.token === "string" ? raw.token : "",
  }),
  component: Approve,
});

function Approve() {
  const { token } = Route.useSearch();
  const [info, setInfo] = useState<{
    name: string | null;
    email: string | null;
    note: string;
    status: string;
  } | null | "loading">("loading");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setInfo(null);
      return;
    }
    void peekStaffRequest({ data: token }).then((row) => setInfo(row));
  }, [token]);

  if (!token || info === null) {
    return (
      <main className="grid min-h-dvh place-items-center bg-ink px-4 text-cream">
        <p>That approval link is not valid.</p>
      </main>
    );
  }

  if (info === "loading") return <div className="min-h-dvh bg-ink" />;

  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4 text-cream">
      <div className="w-full max-w-md rounded-3xl border border-cream/10 bg-cream/[0.04] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/50">
          Owner only
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Grant staff access</h1>
        <p className="mt-3 text-sm text-cream/70">
          {info.name} ({info.email || "no email"}) asked for the hub.
        </p>
        {info.note ? <p className="mt-2 text-sm text-cream/55">{info.note}</p> : null}

        {info.status === "approved" || result ? (
          <p className="mt-6 text-sm text-emerald-300">
            {result ?? "Already granted. They can open the hub after signing in."}
          </p>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void grantStaffAccess({ data: token }).then((r) => {
                setBusy(false);
                setResult(
                  r.ok
                    ? `${r.name ?? "They"} now have staff access.`
                    : "Could not grant that request.",
                );
              });
            }}
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-ink"
          >
            {busy ? "Granting…" : "Grant access"}
          </button>
        )}
      </div>
    </main>
  );
}
