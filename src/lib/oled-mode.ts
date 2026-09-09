import { create } from "zustand";

export const OLED_HELP = [
  { title: "DIAL", lines: ["SPIN TO CYCLE", "OR TAP < >"] },
  { title: "OLED", lines: ["CLICK = CLOCK", "CAT NAME STAYS"] },
  { title: "CATS", lines: ["< ,   PREV", "> .   NEXT"] },
  { title: "ENTER", lines: ["ENTER = HOME", "BKSP = BACK"] },
  { title: "LIGHT", lines: ["F5 LIGHT  F6 DARK", "LUMI = RGB GLOW"] },
  { title: "BASIC", lines: ["BASIC = SIMPLE", "FISH = THIS KB"] },
  { title: "HELP", lines: ["DIAL TURNS PAGES", "? EXITS HELP"] },
] as const;

export const useOledMode = create<{
  help: boolean;
  page: number;
  flash: string | null;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  cycleHelp: (delta: number) => void;
  showFlash: (label: string) => void;
  closeFlash: () => void;
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
  showFlash: (label) => set({ flash: label, help: false }),
  closeFlash: () => set({ flash: null }),
}));
