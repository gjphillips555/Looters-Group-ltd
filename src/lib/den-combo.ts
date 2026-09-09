import { create } from "zustand";

export const useDenCombo = create<{
  taps: number;
  armed: boolean;
  bump: () => boolean;
  disarm: () => void;
}>((set, get) => ({
  taps: 0,
  armed: false,
  bump: () => {
    const taps = get().taps + 1;
    if (taps >= 3) {
      set({ taps: 3, armed: true });
      return true;
    }
    set({ taps });
    return false;
  },
  disarm: () => set({ taps: 0, armed: false }),
}));
