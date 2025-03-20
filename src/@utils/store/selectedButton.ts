import { create } from "zustand";

interface State {
  id: string;
  setId: (id: string) => void;
}

const useSelectedButtonStore = create<State>((set) => ({
  id: "tickets",
  setId: (id: string) => set({ id }),
}));

export default useSelectedButtonStore;
