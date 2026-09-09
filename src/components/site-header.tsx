import { AccountButton } from "@/components/account-button";
import { BacklightButton, useBacklight } from "@/components/backlight-button";
import { CartButton } from "@/components/cart-button";
import { HeaderGuide } from "@/components/header-guide";
import { KeyboardPad } from "@/components/keyboard-pad";
import { SimpleHeader } from "@/components/simple-header";
import { MobileSearchToggle, ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHeaderMode } from "@/lib/header-mode";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  const { mode, cycle } = useBacklight();
  const { mode: header, setMode } = useHeaderMode();
  const fish = header === "fish";

  if (!fish) {
    return (
      <>
        <SimpleHeader onOpenCart={onOpenCart} onFish={() => setMode("fish")} />
        <HeaderGuide fish={false} onToggle={() => setMode("fish")} />
      </>
    );
  }

  return (
    <>
      <header className="header-fish sticky top-0 z-30 overflow-visible bg-transparent">
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
      <HeaderGuide fish onToggle={() => setMode("simple")} />
    </>
  );
}
