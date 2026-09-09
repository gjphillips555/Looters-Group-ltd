import { CmdLogo } from "@/components/brand-logo";
import { CategoryDial } from "@/components/category-dial";
import { KeyButton, KeyLink } from "@/components/key-button";
import { useDenCombo } from "@/lib/den-combo";
import { useOledGame } from "@/lib/oled-game";
import { useOledMode } from "@/lib/oled-mode";
import { useShopCategory } from "@/lib/shop-nav";
import { useNavigate } from "@tanstack/react-router";

export function KeyboardPad() {
  const { cycle } = useShopCategory();
  const help = useOledMode((s) => s.help);
  const toggleHelp = useOledMode((s) => s.toggleHelp);
  const closeHelp = useOledMode((s) => s.closeHelp);
  const playing = useOledGame((s) => s.active);
  const over = useOledGame((s) => s.over);
  const startGame = useOledGame((s) => s.start);
  const stopGame = useOledGame((s) => s.stop);
  const unpick = useOledGame((s) => s.unpick);
  const pressJump = useOledGame((s) => s.pressJump);
  const releaseJump = useOledGame((s) => s.releaseJump);
  const setRun = useOledGame((s) => s.setRun);
  const navigate = useNavigate();
  const armed = useDenCombo((s) => s.armed);
  const disarm = useDenCombo((s) => s.disarm);

  function step(delta: number) {
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
          onClick={() => {
            stopGame();
            unpick();
            closeHelp();
          }}
        >
          {" "}
        </KeyLink>
        <KeyLink
          to={armed ? "/hidden" : "/"}
          size="sm"
          tone="orange"
          className="kb-enter-h"
          aria-label={armed ? "Open den" : "Enter, home"}
          onClick={(e) => {
            stopGame();
            unpick();
            closeHelp();
            if (armed) {
              e.preventDefault();
              disarm();
              void navigate({ to: "/hidden" });
            }
          }}
        >
          ↵
        </KeyLink>
      </div>

      <KeyButton
        size="sm"
        tone="teal"
        className="kb-pad-prev"
        aria-label={playing ? "Jump" : "Previous category"}
        onPointerDown={(e) => {
          if (!playing) return;
          e.preventDefault();
          if (over) startGame();
          else pressJump();
        }}
        onPointerUp={() => playing && releaseJump()}
        onPointerLeave={() => playing && releaseJump()}
        onClick={() => {
          if (!playing) step(-1);
        }}
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
        aria-label={playing ? "Run right" : "Next category"}
        onPointerDown={(e) => {
          if (!playing) return;
          e.preventDefault();
          if (over) startGame();
          else setRun(true);
        }}
        onPointerUp={() => playing && setRun(false)}
        onPointerLeave={() => playing && setRun(false)}
        onClick={() => {
          if (!playing) step(1);
        }}
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
        aria-label={playing ? "Quit game" : "Help"}
        onClick={() => {
          if (playing) {
            stopGame();
            return;
          }
          toggleHelp();
        }}
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
