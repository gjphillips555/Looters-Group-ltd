import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveListings } from "@/components/live-listings";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ResponsiveImage } from "@/components/responsive-image";

export const Route = createFileRoute("/")({ component: Home });

const TITLE = "/brand/logos/title.png";

function Home() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-14">
        <h1 className="sr-only">Looters Computas</h1>
        <ResponsiveImage
          src={TITLE}
          alt="Looters Computas"
          width={480}
          height={154}
          sizes="(max-width: 640px) 70vw, 320px"
          priority
          quality={85}
          className="mx-auto h-20 w-auto max-w-[min(100%,18rem)] object-contain sm:h-24"
        />
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Refurbished PCs, laptops and parts. Listed online — courier nationwide or
          pickup by arrangement. Shop closed; working from home.
        </p>
        <Link
          to="/computas/shop"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-computas-hot px-6 text-sm font-semibold text-white"
        >
          Shop live listings
        </Link>
      </section>

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
