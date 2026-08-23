import { create } from "zustand";

const KEY = "looters-staff";
const PIN_KEY = "looters-owner-pin";

type StaffState = {
  ready: boolean;
  signedIn: boolean;
  isOwner: boolean;
  pin: string;
  hydrate: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const useStaff = create<StaffState>((set) => ({
  ready: false,
  signedIn: false,
  isOwner: false,
  pin: "",
  hydrate: () => {
    if (typeof window === "undefined") {
      set({ ready: true, signedIn: false, isOwner: false, pin: "" });
      return;
    }
    const owner = sessionStorage.getItem(KEY) === "1";
    const pin = sessionStorage.getItem(PIN_KEY) ?? "";
    set({ ready: true, signedIn: owner, isOwner: owner, pin });
  },
  login: (username, password) => {
    const ok = username.trim() === "Staff" && password === "Staff";
    if (ok) {
      sessionStorage.setItem(KEY, "1");
      sessionStorage.setItem(PIN_KEY, password);
      set({ signedIn: true, ready: true, isOwner: true, pin: password });
    }
    return ok;
  },
  logout: () => {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(PIN_KEY);
    set({ signedIn: false, isOwner: false, pin: "" });
  },
}));
