import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  const { user, isPending } = useCurrentUserState();
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

  return (
    <BranchShell>
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-3xl font-extrabold">Account</h1>
        <p className="mt-2 text-muted">{user.displayName ?? user.primaryEmail}</p>
        <p className="mt-6 text-sm text-muted">
          Member features for forum and messages sit here as the group grows.
        </p>
        <Link to="/" className="mt-8 inline-block text-sm font-semibold hover:underline">
          Home
        </Link>
      </main>
    </BranchShell>
  );
}
