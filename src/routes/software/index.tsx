import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { SystemCarousel } from "@/components/system-carousel";
import { SoftwareGrid } from "@/components/software-grid";
import type { OsId } from "@/lib/os-systems";

export const Route = createFileRoute("/software/")({ component: SoftwareHome });

function SoftwareHome() {
  const [os, setOs] = useState<OsId>("win11");

  return (
    <BranchShell>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-software">
          Looters Software
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
          Tools & open source
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Pick your system, then browse free open-source utilities, pentest tools, game
          launchers/emulators, and creative apps. Plus our own Overlay Studio for listing
          photos.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/software/overlay"
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-ink/90"
          >
            Open Overlay Studio
          </Link>
        </div>

        <div className="mt-12">
          <SystemCarousel value={os} onChange={setOs} />
        </div>

        <SoftwareGrid os={os} />
      </main>
    </BranchShell>
  );
}
