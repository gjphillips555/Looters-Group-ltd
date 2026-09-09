import { useEffect, useState } from "react";

export type HeaderMode = "fish" | "simple";
const KEY = "looters-header";

export function useHeaderMode() {
  const [mode, setModeState] = useState<HeaderMode>("simple");

  useEffect(() => {
    setModeState("simple");
    try {
      localStorage.setItem(KEY, "simple");
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
