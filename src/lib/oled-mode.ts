import { create } from "zustand";

export const OLED_HELP = [
  { title: "DIAL", lines: ["SPIN TO CYCLE", "DSKTP  LPTP  CMPNT"] },
  { title: "OLED", lines: ["HOVER = CLOCK", "TAP = LOGO / TIME"] },
  { title: "KEYS", lines: ["DSKTP LPTP CMPNT", "HOME   INFO"] },
  { title: "INFO", lines: ["INFO AGAIN EXITS", "HOME EXITS TOO"] },
] as const;

export const useOledMode = create<{
  help: boolean;
  page: number;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  cycleHelp: (delta: number) => void;
}>((set, get) => ({
  help: false,
  page: 0,
  openHelp: () => set({ help: true, page: 0 }),
  closeHelp: () => set({ help: false, page: 0 }),
  toggleHelp: () => set({ help: !get().help, page: 0 }),
  cycleHelp: (delta) => {
    const n = OLED_HELP.length;
    set({ page: (get().page + delta + n) % n });
  },
}));
