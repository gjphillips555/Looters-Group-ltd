import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSiftaWallet, redeemSiftaLoot, type SiftaWallet } from "@/lib/sifta-loot";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  const { user, isPending } = useCurrentUserState();
  const [wallet, setWallet] = useState<SiftaWallet | null>(null);
  const [amount, setAmount] = useState(10);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    void getSiftaWallet()
      .then(setWallet)
      .catch(() => setWallet(null));
  }, [user?.id]);

  if (isPending) {
    return (
      <BranchShell>
        <main className="mx-auto max-w-lg px-4 py-20">
          <div className="h-24 animate-pulse rounded-3xl bg-line" />
        </main>
      </BranchShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function redeem() {
    setBusy(true);
    setError("");
    const res = await redeemSiftaLoot({ data: amount });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCode(res.code);
    setWallet(res.wallet);
  }

  return (
    <BranchShell>
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Signed in
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Account</h1>
        <p className="mt-2 text-muted">{user.displayName ?? user.primaryEmail}</p>

        <section className="mt-8 rounded-3xl bg-cream p-6 shadow-border">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            <Coins className="size-3.5" /> SiftaLoot wallet
          </p>
          <p className="mt-3 font-display text-4xl font-extrabold tabular-nums">
            {wallet ? wallet.balance : "—"}{" "}
            <span className="text-lg font-semibold text-muted">SL</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Lives on Looters Group — no Sifta Browser needed. 1 SiftaLoot = $1 NZD
            shop credit in store or on a Trade Me listing. Show the code at
            Kilbirnie or in the listing message.
          </p>

          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Redeem
            <input
              type="number"
              min={5}
              max={wallet?.balance ?? 5}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={busy || !wallet || wallet.balance < 5}
            onClick={() => void redeem()}
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-cream disabled:opacity-50"
          >
            {busy ? "Making code…" : "Make a shop code"}
          </button>
          {error ? <p className="mt-2 text-sm text-computas-hot">{error}</p> : null}
          {code ? (
            <p className="mt-3 rounded-2xl bg-ok/10 px-4 py-3 font-mono text-lg font-bold tracking-widest text-ok">
              {code}
            </p>
          ) : null}
        </section>

        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold">Activity</h2>
          <ul className="mt-3 space-y-2">
            {(wallet?.ledger ?? []).length === 0 ? (
              <li className="text-sm text-muted">No movements yet.</li>
            ) : (
              wallet?.ledger.map((row) => (
                <li
                  key={row.id}
                  className="flex items-baseline justify-between gap-3 rounded-2xl bg-cream px-4 py-3 text-sm shadow-border"
                >
                  <div>
                    <p>{row.note}</p>
                    {row.code ? (
                      <p className="mt-0.5 font-mono text-xs text-accent">
                        {row.code} · {row.status}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={
                      row.amount >= 0
                        ? "tabular-nums font-semibold text-ok"
                        : "tabular-nums font-semibold"
                    }
                  >
                    {row.amount >= 0 ? "+" : ""}
                    {row.amount}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <Link to="/" className="mt-8 inline-block text-sm font-semibold hover:underline">
          Home
        </Link>
      </main>
    </BranchShell>
  );
}
