import { Link } from "@tanstack/react-router";
import { AccountButton } from "@/components/account-button";
import { BrandLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_DOMAIN } from "@/lib/site";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-30 overflow-visible">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 border-b border-border bg-background/85 backdrop-blur" />
        <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 flex-col items-start gap-0.5 md:hidden"
            aria-label="Looters Computas home"
          >
            <BrandLogo className="h-12 w-auto max-w-[200px] object-contain" />
            <span className="pl-0.5 text-[10px] font-medium leading-none tracking-wide text-muted-foreground">
              {SITE_DOMAIN}
            </span>
          </Link>
          <Link
            to="/"
            className="relative z-40 hidden h-16 w-[260px] shrink-0 md:block"
            aria-label="Looters Computas home"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2.5 -top-1 h-[7.35rem] w-[18.25rem] rounded-2xl bg-background/85 backdrop-blur"
            />
            <BrandLogo className="absolute left-0 top-0 h-[6.75rem] w-auto max-w-[280px] object-contain object-left-top" />
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ShopSearch className="hidden w-[200px] shrink-0 md:block lg:w-[240px]" />
            <ThemeToggle />
            <AccountButton />
            <CartButton onClick={onOpenCart} />
          </div>
        </div>
      </div>
    </header>
  );
}
