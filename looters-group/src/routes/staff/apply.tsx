import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { applyForStaff, getStaffStatus } from "@/lib/staff-access";

export const Route = createFileRoute("/staff/apply")({ component: StaffApply });

function StaffApply() {
  const { user, isPending } = useCurrentUserState();
  const [note, setNote] = useState("");
  const [done, setDone] = useState<"form" | "sent" | "pending" | "staff">("form");
  const [busy, setBusy] = useState(false);
  const [mailed, setMailed] = useState(false);

  if (isPending) return <div className="min-h-dvh bg-ink" />;
  if (!user) return <RedirectToSignIn to="/login" />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const status = await getStaffStatus();
      if (status.staff) {
        setDone("staff");
        return;
      }
      const res = await applyForStaff({
        data: { note, origin: window.location.origin },
      });
      setMailed(res.mailed);
      setDone(res.pending ? "pending" : "sent");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4 text-cream">
      <div className="w-full max-w-md rounded-3xl border border-cream/10 bg-cream/[0.04] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/50">
          Staff signup
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Ask for the hub</h1>
        <p className="mt-2 text-sm text-cream/65">
          Signed in as {user.displayName ?? user.primaryEmail}. Access is not
          automatic. An email goes to the owner — only they can press Grant access.
        </p>

        {done === "form" ? (
          <form className="mt-6" onSubmit={(e) => void submit(e)}>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-cream/50">
              Why you need staff tools
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-cream/15 bg-ink px-3 py-2 text-sm text-cream"
                placeholder="Shop floor / packing / listings…"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-cream disabled:opacity-50"
            >
              {busy ? "Sending…" : "Send request"}
            </button>
          </form>
        ) : done === "staff" ? (
          <p className="mt-6 text-sm">You’re already on the staff list.</p>
        ) : done === "pending" ? (
          <p className="mt-6 text-sm">A request is already waiting for the owner.</p>
        ) : (
          <p className="mt-6 text-sm">
            Request lodged. {mailed
              ? "The owner has been emailed. Nothing happens until they press the button in that email."
              : "The owner has to press Grant access in their approval mail. If they have not set an inbox yet, they will see the request after they sign into the hub."}
          </p>
        )}

        <div className="mt-8 flex gap-4 text-sm text-cream/60">
          <Link to="/staff" className="hover:text-cream">
            Hub
          </Link>
          <Link to="/" className="hover:text-cream">
            Storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
