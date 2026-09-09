import { useEffect, useState } from "react";

export type HeaderMode = "fish" | "simple";
const KEY = "looters-header";

export function useHeaderMode() {
  const [mode, setModeState] = useState<HeaderMode>("fish");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "simple" || stored === "fish") setModeState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  function setMode(next: HeaderMode) {
    setModeState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }

  return { mode, setMode };
}
