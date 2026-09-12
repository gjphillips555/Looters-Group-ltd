import { useEffect, useState } from "react";

export type HeaderMode = "fish" | "simple";
const KEY = "looters-header";

function readStored(): HeaderMode {
  if (typeof window === "undefined") return "simple";
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "simple" || stored === "fish") return stored;
  } catch {
    /* ignore */
  }
  return "simple";
}

export function useHeaderMode() {
  // First visit (and SSR) is always the basic header. After that we keep
  // whatever they last used — Fish or Basic.
  const [mode, setModeState] = useState<HeaderMode>("simple");

  useEffect(() => {
    setModeState(readStored());
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
