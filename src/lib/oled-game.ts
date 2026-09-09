import { create } from "zustand";

export const useOledGame = create<{
  picked: boolean;
  active: boolean;
  over: boolean;
  run: boolean;
  jumpHeld: boolean;
  jumpSeq: number;
  runId: number;
  pick: () => void;
  unpick: () => void;
  start: () => void;
  stop: () => void;
  setOver: (over: boolean) => void;
  setRun: (run: boolean) => void;
  pressJump: () => void;
  releaseJump: () => void;
}>((set) => ({
  picked: false,
  active: false,
  over: false,
  run: false,
  jumpHeld: false,
  jumpSeq: 0,
  runId: 0,
  pick: () =>
    set({
      picked: true,
      active: false,
      over: false,
      run: false,
      jumpHeld: false,
    }),
  unpick: () =>
    set({
      picked: false,
      active: false,
      over: false,
      run: false,
      jumpHeld: false,
    }),
  start: () =>
    set((s) => ({
      picked: true,
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
