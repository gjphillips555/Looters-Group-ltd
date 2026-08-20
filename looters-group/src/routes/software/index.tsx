import { createFileRoute } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { OverlayDownload } from "@/components/overlay-download";
import { SiftaAd } from "@/components/sifta-ad";

export const Route = createFileRoute("/software/")({ component: SoftwareHome });

function SoftwareHome() {
  return (
    <BranchShell branch="software">
      <main>
        <section className="bg-ink text-cream">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:py-16">
            <SiftaAd />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-software-hot">
                Looters · Software · coming soon
              </p>
              <h1 className="mt-3 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
                Sifta Browser
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/80">
                Privacy first. So easy even your toddler could use it. Available here
                soon.
              </p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-software">
            Available now
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold">Overlay</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Listing photos, your marks. Upload a product shot and your own logos or
            badges — no Looters overlays included. Place them, style the frame,
            download a 2048×1536 PNG.
          </p>
          <OverlayDownload />
        </section>
      </main>
    </BranchShell>
  );
}
