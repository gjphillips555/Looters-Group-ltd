import { create } from "zustand";

export const useProductSearch = create<{
  query: string;
  setQuery: (query: string) => void;
}>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
