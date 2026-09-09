import { create } from "zustand";

export const OLED_HELP = [
  { title: "DIAL", lines: ["SPIN TO CYCLE", "OR TAP CAT KEY"] },
  { title: "OLED", lines: ["CLICK = CLOCK", "CAT KEY = LABEL"] },
  { title: "KEYS", lines: ["< CAT > CYCLES", "ENTER = HOME"] },
  { title: "INFO", lines: ["INFO AGAIN EXITS", "ENTER EXITS TOO"] },
] as const;

let flashTimer: number | undefined;

export const useOledMode = create<{
  help: boolean;
  page: number;
  flash: string | null;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  cycleHelp: (delta: number) => void;
  showFlash: (label: string) => void;
}>((set, get) => ({
  help: false,
  page: 0,
  flash: null,
  openHelp: () => set({ help: true, page: 0, flash: null }),
  closeHelp: () => set({ help: false, page: 0 }),
  toggleHelp: () => set({ help: !get().help, page: 0, flash: null }),
  cycleHelp: (delta) => {
    const n = OLED_HELP.length;
    set({ page: (get().page + delta + n) % n });
  },
  showFlash: (label) => {
    if (typeof window !== "undefined") window.clearTimeout(flashTimer);
    set({ flash: label, help: false });
    if (typeof window !== "undefined") {
      flashTimer = window.setTimeout(() => {
        set({ flash: null });
      }, 1400);
    }
  },
}));
