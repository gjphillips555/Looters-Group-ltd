import { CmdLogo } from "@/components/brand-logo";
import { CategoryDial } from "@/components/category-dial";
import { KeyButton, KeyLink } from "@/components/key-button";
import { useOledMode } from "@/lib/oled-mode";
import { CYCLE_LABEL, scrollPage, useShopCategory } from "@/lib/shop-nav";

export function KeyboardPad() {
  const { active, select, cycle } = useShopCategory();
  const help = useOledMode((s) => s.help);
  const toggleHelp = useOledMode((s) => s.toggleHelp);
  const closeHelp = useOledMode((s) => s.closeHelp);

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
          className="kb-enter-l"
          tone="cream"
          aria-label="Enter, home"
          onClick={() => closeHelp()}
        >
          ↵
        </KeyLink>
      </div>

      <KeyButton
        size="sm"
        className="kb-pad-prev"
        aria-label="Previous category"
        onClick={() => cycle(-1)}
      >
        <span className="kb-dual">
          <b>{"<"}</b>
          <i>,</i>
        </span>
      </KeyButton>
      <KeyButton
        size="sm"
        className="kb-pad-now"
        aria-label={`Category ${CYCLE_LABEL[active]}`}
        onClick={() => select(active)}
      >
        {CYCLE_LABEL[active]}
      </KeyButton>
      <KeyButton
        size="sm"
        className="kb-pad-next"
        aria-label="Next category"
        onClick={() => cycle(1)}
      >
        <span className="kb-dual">
          <b>{">"}</b>
          <i>.</i>
        </span>
      </KeyButton>

      <KeyButton
        size="sm"
        tone="cream"
        className="kb-pad-info"
        active={help}
        onClick={() => toggleHelp()}
      >
        Info
      </KeyButton>
      <KeyButton
        size="sm"
        className="kb-pad-pgup"
        aria-label="Page up"
        onClick={() => scrollPage("up")}
      >
        PgUp
      </KeyButton>
      <KeyButton
        size="sm"
        className="kb-pad-pgdn"
        aria-label="Page down"
        onClick={() => scrollPage("down")}
      >
        PgDn
      </KeyButton>
    </div>
  );
}
