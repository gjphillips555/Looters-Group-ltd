import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { LiveListings } from "@/components/live-listings";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ResponsiveImage } from "@/components/responsive-image";

export const Route = createFileRoute("/")({ component: Home });

/** Existing on CDN today — avoid 404s that waste bandwidth */
const TITLE_SRC = "/brand/logos/computas.png";

function Home() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <SiteHeader />

      {/* Hero — CSS wash instead of large decorative PNG (saves a request) */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#f5ebe3]/90 via-[#ebe4f0]/40 to-transparent sm:h-56"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-16">
          <h1 className="sr-only">Looters Computas</h1>
          <ResponsiveImage
            src={TITLE_SRC}
            alt="Looters Computas"
            width={480}
            height={154}
            sizes="(max-width: 640px) 72vw, 360px"
            priority
            quality={80}
            className="h-24 w-auto max-w-[min(100%,20rem)] object-contain sm:h-32 md:h-36"
          />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Refurbished PCs, laptops and parts — listed online, shipped nationwide,
            or pick up by arrangement.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/computas/shop"
              className="inline-flex min-h-12 items-center rounded-full bg-computas-hot px-6 text-sm font-semibold text-white"
            >
              Shop live listings
            </Link>
            <Link
              to="/computas/policy"
              className="inline-flex min-h-12 items-center rounded-full bg-line px-6 text-sm font-semibold text-ink"
            >
              Store policy
            </Link>
          </div>
          <ResponsiveImage
            src="/brand/brands.png"
            alt="We work with HP, AMD, NVIDIA and Intel hardware"
            width={640}
            height={140}
            sizes="(max-width: 640px) 90vw, 520px"
            quality={65}
            className="mt-10 h-11 w-auto max-w-full object-contain sm:h-12"
          />
        </div>
      </section>

      {/* Live stock */}
      <section className="border-t border-line bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Trade Me
              </p>
              <h2 className="font-display text-3xl font-extrabold">Live listings</h2>
            </div>
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

      {/* Payments — single asset on white */}
      <section className="cv-auto border-t border-line bg-white py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Pay your way
          </p>
          <ResponsiveImage
            src="/brand/afterpay-accepted.png"
            alt="Afterpay and cards accepted"
            width={480}
            height={200}
            sizes="(max-width: 640px) 80vw, 360px"
            quality={70}
            className="h-auto w-full max-w-sm object-contain"
          />
        </div>
      </section>

      {/* Store closed → home-based */}
      <section className="cv-auto relative overflow-hidden border-t border-line bg-white pb-16">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f5ebe3]/70 via-transparent to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <MapPin className="size-3.5" /> Wellington
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
              Shop closed — still selling online
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              The Kilbirnie storefront had a good run for a few years, then we shut
              the doors. The internet took over the foot traffic — so Looters
              Computas now runs from home. Same refurbished gear, same Trade Me
              listings, nationwide courier or local pickup by arrangement.
            </p>
            <p className="mt-3 text-sm text-muted">
              Based around Ruru Ave / Kilbirnie, Wellington — no public walk-in
              counter anymore.
            </p>
            <ResponsiveImage
              src="/brand/store-map-mock.png"
              alt="Map pin for Looters Computas near Ruru Ave"
              width={480}
              height={224}
              sizes="(max-width: 768px) 90vw, 400px"
              quality={60}
              className="mt-6 w-full max-w-md rounded-2xl bg-white object-contain ring-1 ring-line"
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              <ResponsiveImage
                src="/brand/storefront.jpg"
                alt="The old Looters Computas shopfront"
                width={900}
                height={411}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={68}
                className="aspect-[21/10] w-full object-cover"
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              The old shopfront — fond memories, sales now online.
            </p>
          </div>
        </div>

        {/* Penguin — small, lazy, clipped at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden">
          <ResponsiveImage
            src="/brand/logos/pointing.png"
            alt=""
            width={160}
            height={160}
            sizes="120px"
            quality={70}
            className="absolute bottom-0 right-6 h-28 w-auto object-contain object-bottom sm:right-12 sm:h-32 md:right-20"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
