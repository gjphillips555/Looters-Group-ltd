import { createFileRoute, Link } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";

export const Route = createFileRoute("/software/")({ component: SoftwareHome });

function SoftwareHome() {
  return (
    <BranchShell>
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Tools</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Overlay Studio</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Listing photos with your own logos and badges. AI background removal, persistent
          overlay library in this browser, 2048×1536 PNG export.
        </p>
        <Link
          to="/software/overlay"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
        >
          Open Overlay Studio
        </Link>
      </main>
    </BranchShell>
  );
}
