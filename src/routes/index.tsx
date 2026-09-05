import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { LiveListings } from "@/components/live-listings";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/")({ component: Home });

/** Prefer new title asset; fall back to computas banner if not uploaded yet */
const TITLE_SRC = "/brand/logos/looters-computas-title.png";
const TITLE_FALLBACK = "/brand/logos/computas.png";

function Home() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <SiteHeader />

      {/* Hero — title logo on white, soft top wave */}
      <section className="relative overflow-hidden bg-white">
        <img
          src="/brand/top-background.png"
          alt=""
          width={1600}
          height={900}
          className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full object-cover object-top opacity-80 sm:h-52"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-16">
          <h1 className="sr-only">Looters Computas</h1>
          <img
            src={TITLE_SRC}
            alt="Looters Computas"
            width={480}
            height={275}
            className="h-28 w-auto max-w-[min(100%,22rem)] object-contain sm:h-40 md:h-48"
            decoding="async"
            fetchPriority="high"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              if (el.src !== TITLE_FALLBACK) el.src = TITLE_FALLBACK;
            }}
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
          <img
            src="/brand/brands.png"
            alt="We work with HP, AMD, NVIDIA and Intel hardware"
            width={900}
            height={196}
            className="mt-10 h-12 w-auto max-w-full object-contain sm:h-14"
            loading="lazy"
            decoding="async"
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
            <div className="flex items-center gap-3">
              <img
                src="/brand/logos/intel-core-i7.jpg"
                alt="Intel Core i7"
                width={64}
                height={64}
                className="h-12 w-12 rounded-lg object-cover ring-1 ring-line"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <Link
                to="/computas/shop"
                className="text-sm font-semibold underline-offset-4 hover:underline"
              >
                Full catalogue
              </Link>
            </div>
          </div>
          <div className="min-h-[16rem]">
            <LiveListings />
          </div>
        </div>
      </section>

      {/* Payments on white */}
      <section className="border-t border-line bg-white py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Pay your way
          </p>
          <img
            src="/brand/payment-methods.png"
            alt="Afterpay, American Express, Mastercard, Visa and Discover accepted"
            width={900}
            height={354}
            className="h-auto w-full max-w-lg object-contain"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.src = "/brand/afterpay-accepted.png";
            }}
          />
          <img
            src="/brand/logos/afterpay.png"
            alt="Afterpay"
            width={200}
            height={80}
            className="h-12 w-auto object-contain"
            loading="lazy"
          />
        </div>
      </section>

      {/* Store closed → home-based */}
      <section className="relative overflow-hidden border-t border-line bg-white pb-16">
        <img
          src="/brand/bottom-background.png"
          alt=""
          width={1600}
          height={900}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full object-cover object-bottom opacity-70"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
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
            <img
              src="/brand/store-map-mock.png"
              alt="Map pin for Looters Computas near Ruru Ave"
              width={900}
              height={420}
              className="mt-6 w-full max-w-md rounded-2xl bg-white object-contain ring-1 ring-line"
              loading="lazy"
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              <img
                src="/brand/storefront.jpg"
                alt="The old Looters Computas shopfront"
                width={1400}
                height={640}
                className="aspect-[21/10] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              The old shopfront — fond memories, sales now online.
            </p>
          </div>
        </div>

        {/* Penguin with no feet — clipped at the bottom edge so it looks behind the section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden">
          <img
            src="/brand/logos/pointing.png"
            alt=""
            width={200}
            height={200}
            className="absolute bottom-0 right-6 h-28 w-auto object-contain object-bottom sm:right-12 sm:h-32 md:right-20"
            loading="lazy"
          />
        </div>
      </section>

      {/* Computas banner strip */}
      <section className="border-t border-line bg-white py-10">
        <div className="mx-auto flex max-w-3xl justify-center px-4">
          <img
            src="/brand/logos/computas.png"
            alt="Looters Computas"
            width={800}
            height={256}
            className="h-16 w-auto max-w-full object-contain sm:h-20"
            loading="lazy"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
