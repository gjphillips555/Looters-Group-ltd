import { Link } from "@tanstack/react-router";
import { AccountButton } from "@/components/account-button";
import { BrandLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-30 overflow-visible">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 border-b border-border bg-background/85 backdrop-blur" />
        <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-start md:hidden"
            aria-label="Looters Computas home"
          >
            <BrandLogo
              variant="oled"
              className="h-12 w-auto max-w-[210px] object-contain"
            />
          </Link>
          <Link
            to="/"
            className="relative z-40 hidden h-16 w-[300px] shrink-0 md:block"
            aria-label="Looters Computas home"
          >
            <BrandLogo
              variant="oled"
              className="absolute left-0 top-1 h-[5.5rem] w-auto max-w-[320px] object-contain object-left-top"
            />
          </Link>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-center md:flex">
            <ShopSearch className="pointer-events-auto w-[200px] lg:w-[280px] xl:w-[320px]" />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <MobileSearchToggle />
            <ThemeToggle />
            <AccountButton />
            <CartButton onClick={onOpenCart} />
          </div>
        </div>
      </div>
    </header>
  );
}
