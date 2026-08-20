import { createFileRoute, Link } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { OverlayStudio } from "@/components/overlay-studio";

export const Route = createFileRoute("/software/overlay")({ component: OverlayPage });

function OverlayPage() {
  return (
    <BranchShell branch="software">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-software">
          Looters Software
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold">Overlay</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Bring your own logos and badges. Drop a listing photo, place overlays on
          the corners, download a 2048×1536 PNG. Nothing of ours is preloaded.
        </p>
        <Link to="/software" className="mt-3 inline-block text-sm hover:underline">
          All software
        </Link>
        <div className="mt-8">
          <OverlayStudio />
        </div>
      </main>
    </BranchShell>
  );
}
