import { AccountButton } from "@/components/account-button";
import { CartButton } from "@/components/cart-button";
import { KeyboardPad } from "@/components/keyboard-pad";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-30 overflow-hidden">
      <div className="header-key">
        <div className="header-key-cap">
          <div className="relative mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
            <KeyboardPad />

            <ShopSearch className="hidden min-w-0 flex-1 md:block md:max-w-[180px] lg:max-w-[240px]" />

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <MobileSearchToggle />
              <ThemeToggle />
              <AccountButton />
              <CartButton onClick={onOpenCart} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
