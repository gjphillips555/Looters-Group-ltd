import { useState } from "react";

const GLOWS = ["off", "red", "green", "blue", "purple"] as const;
export type GlowMode = (typeof GLOWS)[number];

export function BacklightButton({
  mode,
  onCycle,
}: {
  mode: GlowMode;
  onCycle: () => void;
}) {
  return (
    <button
      type="button"
      className="kb-key kb-key-sm kb-orange"
      aria-label="Cycle key backlight"
      title="Backlight"
      onClick={onCycle}
    >
      <span className="kb-cap">
        <span className="kb-lumi" data-on={mode !== "off" ? "true" : "false"}>
          <span />
          <span />
          <span />
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
