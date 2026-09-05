import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { BRANCHES, STORE } from "@/data/catalog";
import { BRANCH_LOGO } from "@/components/brand-logo";
import { LiveListings } from "@/components/live-listings";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AfterpayMark } from "@/components/afterpay-mark";
import { SiftaAd } from "@/components/sifta-ad";
import { ResponsiveImage } from "@/components/responsive-image";

export const Route = createFileRoute("/")({ component: Home });

/** Hero wordmark — WebP first, PNG fallback, density-aware srcset */
function HeroTitleLogo() {
  const sizes = "(max-width: 640px) 72vw, (max-width: 768px) 280px, 360px";
  const webp = [
    "/brand/logos/looters-computas-title-320.webp 320w",
    "/brand/logos/looters-computas-title-480.webp 480w",
    "/brand/logos/looters-computas-title-640.webp 640w",
    "/brand/logos/looters-computas-title-960.webp 960w",
  ].join(", ");
  const png = [
    "/brand/logos/looters-computas-title-320.png 320w",
    "/brand/logos/looters-computas-title-480.png 480w",
    "/brand/logos/looters-computas-title-640.png 640w",
    "/brand/logos/looters-computas-title-960.png 960w",
  ].join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <source type="image/png" srcSet={png} sizes={sizes} />
      <img
        src="/brand/logos/looters-computas-title.png"
        srcSet={png}
        sizes={sizes}
        width={480}
        height={275}
        alt="Looters Computas"
        className="h-28 w-auto max-w-[min(100%,22rem)] object-contain sm:h-40 sm:max-w-[min(100%,28rem)] md:h-48 md:max-w-[min(100%,32rem)]"
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}

function Home() {
  return (
    <div className="min-h-dvh bg-ink text-cream">
      <div className="bg-paper text-ink">
        <SiteHeader />
      </div>

      <section className="relative overflow-hidden">
        <ResponsiveImage
          src="/og.jpg"
          alt=""
          width={1920}
          height={1080}
          sizes="100vw"
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/80 to-ink" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1 className="sr-only">Looters Computas</h1>
          <HeroTitleLogo />
          <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
            {BRANCHES.map((b) => (
              <Link
                key={b.id}
                to={b.href as "/computas" | "/apparel" | "/software"}
                className="flex flex-col items-center rounded-2xl bg-white p-3 text-ink shadow-border transition hover:-translate-y-0.5"
              >
                <ResponsiveImage
                  src={BRANCH_LOGO[b.id]}
                  alt={b.name}
                  width={160}
                  height={96}
                  sizes="120px"
                  className="h-20 w-auto object-contain sm:h-24"
                />
                <span className="sr-only">{b.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 text-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Looters Stores
              </p>
              <h2 className="font-display text-3xl font-extrabold">Live listings</h2>
            </div>
            <Link to="/computas/shop" className="text-sm font-semibold underline-offset-4 hover:underline">
              Full catalogue
            </Link>
          </div>
          <LiveListings />

          <div className="mt-10 flex flex-col items-start gap-6 rounded-3xl bg-cream p-5 shadow-border sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Pay later
              </p>
              <h3 className="mt-1 font-display text-xl font-bold">Afterpay at Looters Stores</h3>
              <p className="mt-2 max-w-md text-sm text-muted">
                Split the cost on Computas and Apparel. Same checkout on Trade Me,
                accepted in store too.
              </p>
            </div>
            <AfterpayMark className="h-20 w-auto sm:h-24" />
          </div>

          <div className="mt-8 flex flex-col items-start gap-5 rounded-3xl bg-ink p-5 text-cream shadow-border sm:flex-row sm:items-center">
            <SiftaAd />
            <div className="max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-software-hot">
                Live
              </p>
              <h3 className="mt-1 font-display text-xl font-bold">Sifta Browser</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">
                Privacy first. So easy even your toddler could use it. Download
                the app. SiftaLoot still works on this site when you sign in.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/software"
                  className="inline-flex min-h-10 items-center text-sm font-semibold text-software-hot hover:underline"
                >
                  Open Sifta on Looters Software
                </Link>
                <Link
                  to="/software"
                  className="inline-flex min-h-10 items-center text-sm font-semibold text-cream/80 hover:underline"
                >
                  Looters Software
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 rounded-3xl bg-cream p-6 shadow-border md:grid-cols-[1.2fr_1fr] md:p-8">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                <MapPin className="size-3.5" /> Visit
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold">Kilbirnie, Wellington</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                Computas keeps machines in service. Apparel is near-new 2nd-life clothing.
                Software is the tools that run it. Same parent, same idea: don’t dump what
                still has a job to do.
              </p>
              <p className="mt-4 text-sm font-medium">
                {STORE.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
            </div>
            <ResponsiveImage
              src="/brand/storefront.jpg"
              alt="Looters Computas storefront with Lootzy the penguin"
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 40vw"
              className="h-56 w-full rounded-2xl object-cover md:h-full"
            />
          </div>
        </div>
        <SiteFooter />
      </section>
    </div>
  );
}
