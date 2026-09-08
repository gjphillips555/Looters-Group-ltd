import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BrandTicker } from "@/components/brand-ticker";
import { CategoryNav } from "@/components/category-nav";
import { ProductGrid } from "@/components/product-grid";
import { ARTWORK } from "@/lib/artwork";
import { getCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  loader: () => getCatalog(),
  head: () => ({
    links: [
      {
        rel: "preload",
        as: "image",
        href: ARTWORK.storefront,
        type: "image/jpeg",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const catalog = Route.useLoaderData();

  return (
    <AppShell>
      <BrandTicker />
      <CategoryNav />

      <div className="space-y-6">
        <NewsCard date="Wed 9 Sep 2026" dateTime="2026-09-09">
          <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Shop's shut. The loot lives on.
          </h1>
          <p className="text-sm font-medium text-accent">
            Loot the best deals on refurbished gear — now from the spare room,
            not the shop floor.
          </p>

          <img
            src={ARTWORK.storefront}
            alt="The old Looters Computas storefront: orange and purple shop front, penguin mascot, Afterpay window, and a Refurbished HP ProDesk 400 in the display"
            width={1600}
            height={720}
            fetchPriority="high"
            decoding="async"
            className="w-full rounded-xl border border-border object-cover"
          />

          <div className="max-w-3xl space-y-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>G'day everyone.</p>
            <p>
              We've closed the physical Looters Computas shop. That orange
              front with the penguin out on the footpath, Afterpay in the
              window, PCs stacked in the glass — that's the old days. Doors
              are shut. We're not trading from the street anymore.
            </p>
            <p>
              We're working from home now. Same people, same refurbished
              gear, just no shop bell. From here on, everything is going to
              be shipped. No walk-ins, no "I'll swing by after work" — if
              you want it, it goes in a box and it comes to you.
            </p>
            <p>
              This website only just went live today, 9 September 2026.
              It's the new shop floor. Have a rummage through Desktops,
              Laptops and Components, chuck finds in the cart, pick your
              shipping on the product page, and we'll tally the total in
              NZD. PayPal's there if you'd rather skip the cart.
            </p>
            <p>
              Give us a bit of grace while we get the online thing humming
              — first week energy, forum-post honesty. The stock is live.
              The deals are the same. The penguin just doesn't have a
              footpath anymore.
            </p>
            <p className="font-medium text-foreground">— Looters</p>
          </div>
        </NewsCard>

        <NewsCard date="Wed 9 Sep 2026" dateTime="2026-09-09">
          <h2 className="text-balance font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Afterpay's still on the table
          </h2>
          <p className="text-sm font-medium text-accent">
            Shop now. Pay later. Always interest-free — four payments, every
            two weeks.
          </p>
          <img
            src={ARTWORK.afterpayNews}
            alt="Afterpay: Shop now, pay it in 4 interest-free instalments."
            width={2201}
            height={1101}
            className="w-full rounded-xl"
          />
          <div className="max-w-3xl space-y-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Want the gear now and spread the cost? Afterpay splits the
              total into four interest-free payments, fortnightly. First
              payment's due when you buy, then three more every two weeks.
            </p>
            <p>
              Afterpay is available when you hit the{" "}
              <span className="font-medium text-foreground">
                Pay via Trade Me
              </span>{" "}
              button on a product or at checkout. Trade Me's checkout is
              where Afterpay shows up — pick it there, log into or create
              your Afterpay account, and you're away. You need a debit or
              credit card, to be 18+, and a NZ resident. Late fees and
              eligibility criteria apply.
            </p>
            <p className="font-medium text-foreground">— Looters</p>
          </div>
        </NewsCard>
      </div>

      <div className="mb-4 mt-10 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Browse the loot</h2>
        <p className="text-sm text-muted-foreground">
          Afterpay Available Now!
        </p>
      </div>
      <ProductGrid
        products={catalog.products}
        error={catalog.error}
        unfiltered
      />

      <div className="mt-6 flex justify-center">
        <Link
          to="/shop"
          className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          All products
        </Link>
      </div>
    </AppShell>
  );
}

function NewsCard({
  date,
  dateTime,
  children,
}: {
  date: string;
  dateTime: string;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-secondary/40 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:px-6">
        <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
          Site news
        </span>
        <span aria-hidden="true">·</span>
        <time dateTime={dateTime}>{date}</time>
        <span aria-hidden="true">·</span>
        <span>Posted today</span>
        <span className="ml-auto normal-case tracking-normal">Looters</span>
      </header>
      <div className="space-y-5 px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </article>
  );
}
