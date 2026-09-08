import { Link } from "@tanstack/react-router";
import { AccountButton } from "@/components/account-button";
import { CmdLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-30 overflow-visible">
      <div className="relative">
        <div className="header-key">
          <div className="header-key-cap">
            <div className="relative mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
              <div className="flex shrink-0 md:hidden">
                <CmdLogo compact />
              </div>
              <div className="hidden h-14 w-[24.5rem] shrink-0 md:block" />

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
        </div>

        <Link
          to="/"
          className="logo-hang hidden md:block"
          aria-label="Looters Computas home"
        >
          <span className="logo-hang-key">
            <CmdLogo />
          </span>
        </Link>
      </div>
    </header>
  );
}
