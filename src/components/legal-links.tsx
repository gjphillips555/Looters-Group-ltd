import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LegalLinks({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] tracking-wide text-muted-foreground",
        className,
      )}
      aria-label="Legal"
    >
      <Link
        to="/termsandconditions"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Terms and Conditions
      </Link>
      <span className="text-neutral-400" aria-hidden="true">
        ·
      </span>
      <Link
        to="/storepolicy"
        className="underline-offset-2 hover:text-foreground hover:underline"
      >
        Store Policy
      </Link>
    </nav>
  );
}
