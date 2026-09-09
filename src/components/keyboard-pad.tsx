import { CmdLogo } from "@/components/brand-logo";
import { CategoryDial } from "@/components/category-dial";
import { KeyButton, KeyLink } from "@/components/key-button";
import { useOledMode } from "@/lib/oled-mode";
import { SHOP_CATEGORIES } from "@/lib/product-search";
import { CYCLE_LABEL, useShopCategory } from "@/lib/shop-nav";

export function KeyboardPad() {
  const { active, cycle } = useShopCategory();
  const help = useOledMode((s) => s.help);
  const toggleHelp = useOledMode((s) => s.toggleHelp);
  const closeHelp = useOledMode((s) => s.closeHelp);
  const showFlash = useOledMode((s) => s.showFlash);

  function step(delta: number) {
    const n = SHOP_CATEGORIES.length;
    const i = SHOP_CATEGORIES.findIndex((c) => c.id === active);
    const next = SHOP_CATEGORIES[(i + delta + n) % n];
    showFlash(CYCLE_LABEL[next.id]);
    cycle(delta);
  }

  return (
    <div className="kb-pad" aria-label="Keyboard">
      <div className="kb-pad-oled">
        <div className="logo-hang">
          <CmdLogo />
        </div>
      </div>

      <div className="kb-enter-well">
        <CategoryDial />
        <KeyLink
          to="/"
          size="sm"
          tone="orange"
          className="kb-enter-v"
          aria-label="Enter, home"
          onClick={() => closeHelp()}
        >
          {" "}
        </KeyLink>
        <KeyLink
          to="/"
          size="sm"
          tone="orange"
          className="kb-enter-h"
          aria-label="Enter, home"
          onClick={() => closeHelp()}
        >
          ↵
        </KeyLink>
      </div>

      <KeyButton
        size="sm"
        tone="teal"
        className="kb-pad-prev"
        aria-label="Previous category"
        onClick={() => step(-1)}
      >
        <span className="kb-dual">
          <b>{"<"}</b>
          <i>,</i>
        </span>
      </KeyButton>
      <KeyButton
        size="sm"
        tone="teal"
        className="kb-pad-next"
        aria-label="Next category"
        onClick={() => step(1)}
      >
        <span className="kb-dual">
          <b>{">"}</b>
          <i>.</i>
        </span>
      </KeyButton>
      <KeyButton
        size="sm"
        tone="teal"
        className="kb-pad-help"
        data-lit={help ? "true" : "false"}
        aria-label="Help"
        onClick={() => toggleHelp()}
      >
        <span className="kb-dual">
          <b>?</b>
          <i>/</i>
        </span>
      </KeyButton>
      <KeyButton
        size="sm"
        tone="white"
        className="kb-pad-bksp kb-desk"
        aria-label="Backspace, browser back"
        onClick={() => window.history.back()}
      >
        <span className="kb-dual">
          <b>⌫</b>
          <i>Bksp</i>
        </span>
      </KeyButton>
    </div>
  );
}
