import { AccountButton } from "@/components/account-button";
import { BacklightButton, useBacklight } from "@/components/backlight-button";
import { CartButton } from "@/components/cart-button";
import { KeyboardPad } from "@/components/keyboard-pad";
import { SimpleHeader } from "@/components/simple-header";
import { ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHeaderMode } from "@/lib/header-mode";
import { useOledGame } from "@/lib/oled-game";

export function SiteHeader({ onOpenCart }: { onOpenCart: () => void }) {
  const { mode, cycle } = useBacklight();
  const { mode: header, setMode } = useHeaderMode();
  const fish = header === "fish";
  const picked = useOledGame((s) => s.picked);
  const playing = useOledGame((s) => s.active);
  const over = useOledGame((s) => s.over);
  const startGame = useOledGame((s) => s.start);
  const waiting = picked && (!playing || over);

  if (!fish) {
    return <SimpleHeader onOpenCart={onOpenCart} onFish={() => setMode("fish")} />;
  }

  return (
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
            <ShopSearch className="kb-desk hidden min-w-0 md:block md:max-w-[240px] lg:max-w-[300px]" />
            <span className="kb-desk contents">
              <ThemeToggle />
            </span>
            <BacklightButton
              mode={mode}
              wait={waiting}
              onCycle={() => {
                if (waiting) startGame();
                else cycle();
              }}
            />
            <AccountButton showF8 />
            <CartButton onClick={onOpenCart} />
            <button
              type="button"
              className="kb-key kb-key-sm kb-teal"
              onClick={() => setMode("simple")}
              aria-label="Switch to basic header"
              title="Basic header"
            >
              <span className="kb-cap">
                <span className="kb-dual">
                  <b>F10</b>
                  <i>Basic</i>
                </span>
              </span>
            </button>
            <span
              className="kb-led kb-led-blue kb-led-tail md:hidden"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
