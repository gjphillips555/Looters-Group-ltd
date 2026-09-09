import { AccountButton } from "@/components/account-button";
import { BacklightButton, useBacklight } from "@/components/backlight-button";
import { CartButton } from "@/components/cart-button";
import { KeyboardPad } from "@/components/keyboard-pad";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  const { mode, cycle } = useBacklight();

  return (
    <header className="sticky top-0 z-30 overflow-visible bg-transparent">
      <div className="px-3 pt-2 sm:px-6">
        <div className="kb-board" data-glow={mode}>
          <div className="kb-board-keys">
            <KeyboardPad />
            <div className="kb-leds" aria-hidden="true">
              <span className="kb-led kb-led-rgb" />
              <span className="kb-led kb-led-blue" />
              <span className="kb-led kb-led-boot" />
            </div>
          </div>
          <div className="kb-utils">
            <ShopSearch className="hidden min-w-0 md:block md:max-w-[170px] lg:max-w-[210px]" />
            <MobileSearchToggle />
            <ThemeToggle />
            <BacklightButton mode={mode} onCycle={cycle} />
            <AccountButton />
            <CartButton onClick={onOpenCart} />
          </div>
        </div>
      </div>
    </header>
  );
}
