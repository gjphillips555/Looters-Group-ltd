import { createFileRoute } from "@tanstack/react-router";
import { BranchShell } from "@/components/site-chrome";
import { OverlayDownload } from "@/components/overlay-download";
import { SiftaAd } from "@/components/sifta-ad";
import { SiftaCompare } from "@/components/sifta-compare";
import { SiftaFrame, SiftaLaunch } from "@/components/sifta-launch";

export const Route = createFileRoute("/software/")({ component: SoftwareHome });

function SoftwareHome() {
  return (
    <BranchShell branch="software">
      <main>
        <section className="bg-ink text-cream">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:py-16">
            <SiftaAd />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-software-hot">
                Looters · Software · live
              </p>
              <h1 className="mt-3 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
                Sifta Browser
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/80">
                Privacy first. So easy even your toddler could use it. Chromium app
                for Windows, Mac, Linux and Android — or open it in any browser.
              </p>
              <div className="mt-6">
                <SiftaLaunch />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-ink pb-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SiftaFrame />
          </div>
        </section>
        <SiftaCompare />
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
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-software">
            SiftaLoot
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold">Wallet on this site</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Sign in and your SiftaLoot balance sits next to your avatar. It lives
            here so you can use it without Sifta Browser — redeem a shop code for
            Looters Stores or Trade Me.
          </p>
        </section>
      </main>
    </BranchShell>
  );
}
