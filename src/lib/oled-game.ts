import { create } from "zustand";

export const useOledGame = create<{
  active: boolean;
  over: boolean;
  run: boolean;
  jumpHeld: boolean;
  jumpSeq: number;
  runId: number;
  start: () => void;
  stop: () => void;
  setOver: (over: boolean) => void;
  setRun: (run: boolean) => void;
  pressJump: () => void;
  releaseJump: () => void;
}>((set) => ({
  active: false,
  over: false,
  run: false,
  jumpHeld: false,
  jumpSeq: 0,
  runId: 0,
  start: () =>
    set((s) => ({
      active: true,
      over: false,
      run: false,
      jumpHeld: false,
      jumpSeq: 0,
      runId: s.runId + 1,
    })),
  stop: () =>
    set({
      active: false,
      over: false,
      run: false,
      jumpHeld: false,
    }),
  setOver: (over) => set({ over, run: false, jumpHeld: false }),
  setRun: (run) => set({ run }),
  pressJump: () => set((s) => ({ jumpHeld: true, jumpSeq: s.jumpSeq + 1 })),
  releaseJump: () => set({ jumpHeld: false }),
}));
