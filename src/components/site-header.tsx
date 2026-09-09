import { AccountButton } from "@/components/account-button";
import { CmdLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { CategoryDial } from "@/components/category-dial";
import { HeaderCategories } from "@/components/header-categories";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-30 overflow-visible">
      <div className="header-key">
        <div className="header-key-cap">
          <div className="relative mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
            <div className="oled-cluster">
              <div className="logo-hang">
                <CmdLogo />
              </div>
              <CategoryDial />
            </div>

            <HeaderCategories />

            <ShopSearch className="hidden min-w-0 flex-1 md:block md:max-w-[200px] lg:max-w-[260px]" />

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <MobileSearchToggle />
              <ThemeToggle />
              <AccountButton />
              <CartButton onClick={onOpenCart} />
            </div>
          </div>
        </div>

        <span className="oled-cradle md:hidden" aria-hidden="true" />
      </div>
    </header>
  );
}
