import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveListings } from "@/components/live-listings";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StoreCarousel, GROUP_LOGO_SRC } from "@/components/store-carousel";
import { PromoVideo } from "@/components/promo-video";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-4 pb-4 pt-12 text-center sm:px-6 sm:pt-14">
        <h1 className="sr-only">Looters Group Ltd</h1>
        <img
          src={GROUP_LOGO_SRC}
          alt="Looters Group Ltd"
          className="mx-auto h-16 w-auto max-w-[min(100%,18rem)] object-contain sm:h-20"
        />
        <p className="mt-4 text-sm text-muted sm:text-base">
          Refurbished PCs · Software · Apparel — Wellington
        </p>
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

      <section className="border-t border-line bg-cream/40 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Looters Computas
          </p>
          <h2 className="mt-2 text-center font-display text-2xl font-extrabold sm:text-3xl">
            The Shoshana Sale
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted">
            10% off — prices more down than ever.
          </p>
          <div className="mt-6">
            <PromoVideo />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
