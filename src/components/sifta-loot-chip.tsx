import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSiftaWallet } from "@/lib/sifta-loot";

export function SiftaLootChip() {
  const { user, isPending } = useCurrentUserState();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setBalance(null);
      return;
    }
    let live = true;
    void getSiftaWallet()
      .then((w) => {
        if (live) setBalance(w.balance);
      })
      .catch(() => {
        if (live) setBalance(null);
      });
    return () => {
      live = false;
    };
  }, [user?.id]);

  if (isPending || !user) return null;
  if (balance === null) {
    return <div className="h-10 w-[4.5rem] animate-pulse rounded-full bg-line" />;
  }

  return (
    <Link
      to="/account"
      title="SiftaLoot wallet — works without Sifta Browser"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent/10 px-3 text-xs font-semibold text-accent hover:bg-accent/15"
    >
      <Coins className="size-3.5" aria-hidden />
      <span className="tabular-nums">{balance}</span>
      <span className="hidden sm:inline">SiftaLoot</span>
      <span className="sm:hidden">SL</span>
    </Link>
  );
}
