import { create } from "zustand";

export const OLED_HELP = [
  { title: "DIAL", lines: ["SPIN TO CYCLE", "OR TAP < >"] },
  { title: "OLED", lines: ["CLICK = CLOCK", "CONTINUE? EXITS"] },
  { title: "KEYS", lines: ["< ,   > .", "? /  HELP"] },
  { title: "BKSP", lines: ["BACKSPACE = BACK", "ENTER = HOME"] },
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
