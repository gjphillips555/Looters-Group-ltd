import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveListings } from "@/components/live-listings";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StoreCarousel } from "@/components/store-carousel";
import { STORE_LOGOS } from "@/lib/store-logos";

export const Route = createFileRoute("/")({ component: Home });

const GROUP = STORE_LOGOS.find((s) => s.id === "groupLtd")!;

function Home() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-4 pb-4 pt-12 text-center sm:px-6 sm:pt-14">
        <h1 className="sr-only">Looters Group Ltd</h1>
        <img
          src={GROUP.src}
          alt="Looters Group Ltd"
          className="mx-auto h-20 w-auto max-w-[min(100%,20rem)] object-contain sm:h-24"
        />
      </section>

      <StoreCarousel />

      <section className="border-t border-line py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Live listings</h2>
            <Link
              to="/computas/shop"
              className="text-sm font-semibold underline-offset-4 hover:underline"
            >
              Full catalogue
            </Link>
          </div>
          <div className="min-h-[16rem]">
            <LiveListings />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
