import { useState } from "react";

const GLOWS = ["off", "red", "green", "blue", "purple"] as const;
export type GlowMode = (typeof GLOWS)[number];

export function BacklightButton({
  mode,
  onCycle,
  wait = false,
}: {
  mode: GlowMode;
  onCycle: () => void;
  wait?: boolean;
}) {
  return (
    <button
      type="button"
      className="kb-key kb-key-sm kb-orange"
      aria-label={wait ? "Confirm game play" : "Cycle key backlight"}
      title={wait ? "Press to start game" : "Backlight"}
      data-lit={wait ? "true" : "false"}
      onClick={onCycle}
    >
      <span className="kb-cap">
        <span className="kb-dual">
          <b>F7</b>
          <i>
            <span
              className="kb-lumi"
              data-on={mode !== "off" || wait ? "true" : "false"}
              data-wait={wait ? "true" : "false"}
            >
              <span />
              <span />
              <span />
            </span>
          </i>
        </span>
      </span>
    </button>
  );
}

export function useBacklight() {
  const [mode, setMode] = useState<GlowMode>("off");
  function cycle() {
    setMode((prev) => GLOWS[(GLOWS.indexOf(prev) + 1) % GLOWS.length]);
  }
  return { mode, cycle };
}
