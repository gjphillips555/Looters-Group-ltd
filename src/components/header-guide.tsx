import { useEffect, useState } from "react";

export function HeaderGuide({
  fish,
  onToggle,
}: {
  fish: boolean;
  onToggle: () => void;
}) {
  const [held, setHeld] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const onChange = () => setCoarse(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const show = coarse ? mobileOpen : held;

  return (
    <div className="header-guide">
      {fish ? (
        <>
          <p className="header-guide-copy">
            Try out our Attack Fish Replica Keyboard for browsing our site
            click here for instructions:
          </p>
          <button
            type="button"
            className="kb-key kb-key-sm kb-teal header-guide-hold"
            aria-label="Instructions"
            onPointerDown={() => {
              if (coarse) setMobileOpen((v) => !v);
              else setHeld(true);
            }}
            onPointerUp={() => {
              if (!coarse) setHeld(false);
            }}
            onPointerLeave={() => {
              if (!coarse) setHeld(false);
            }}
            onPointerCancel={() => {
              if (!coarse) setHeld(false);
            }}
          >
            <span className="kb-cap">{coarse ? (mobileOpen ? "Close" : "How?") : "Hold"}</span>
          </button>
          {show ? (
            <div className="header-guide-pop">
              <p>
                <b>OLED</b> — click for the clock. Categories flash then stay.
              </p>
              <p>
                <b>Dial</b> — spin or tap to cycle. Hover shows rotate.
              </p>
              <p>
                <b>{"< ,"} / {"> ."}</b> — previous / next category.
              </p>
              <p>
                <b>↵ Enter</b> — home. <b>Bksp</b> — browser back. <b>? /</b> — help.
              </p>
              <p>
                <b>F5 / F6</b> — light / dark. Backlight key cycles RGB glow.
              </p>
              <p>
                <b>PgUp / PgDn</b> — jump top or bottom of the page.
              </p>
            </div>
          ) : null}
          <p className="header-guide-note">
            Note: If not really your thing switch the switch for the original
            simple header.
          </p>
        </>
      ) : (
        <p className="header-guide-note">Attack Fish keyboard is off.</p>
      )}
      <label className="header-guide-switch">
        <span className="sr-only">Simple header</span>
        <input
          type="checkbox"
          checked={!fish}
          onChange={onToggle}
        />
        <span className="header-guide-knob" data-on={!fish ? "true" : "false"} />
        <span>{fish ? "Simple" : "Fish"}</span>
      </label>
    </div>
  );
}
