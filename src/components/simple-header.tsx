import { Link } from "@tanstack/react-router";
import { AccountButton } from "@/components/account-button";
import { BrandLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_DOMAIN } from "@/lib/site";

export function SimpleHeader({
  onOpenCart,
  onFish,
}: {
  onOpenCart: () => void;
  onFish: () => void;
}) {
  return (
    <header className="sticky top-0 z-30">
      <div className="header-key header-key-solid">
        <div className="header-key-cap header-key-cap-solid">
          <div className="relative mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
            <Link to="/" className="flex shrink-0 flex-col items-center" aria-label="Looters Computas home">
              <BrandLogo className="h-10 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[220px]" />
              <span className="text-[9px] font-medium tracking-wide text-muted-foreground">
                {SITE_DOMAIN}
              </span>
            </Link>

            <ShopSearch className="hidden min-w-0 flex-1 md:block md:max-w-[200px] lg:max-w-[260px]" />

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <Link
                to="/overlay"
                className="kb-key kb-key-sm hidden sm:inline-flex"
                title="Overlay Studio — separate from shop"
              >
                <span className="kb-cap">Overlay</span>
              </Link>
              <MobileSearchToggle />
              <ThemeToggle />
              <AccountButton />
              <CartButton onClick={onOpenCart} />
              <button
                type="button"
                className="kb-key kb-key-sm kb-teal"
                onClick={onFish}
                aria-label="Switch to Attack Fish keyboard"
                title="Attack Fish keyboard"
              >
                <span className="kb-cap">Fish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
