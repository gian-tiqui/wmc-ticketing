import { create } from "zustand";

interface State {
  id: string;
  setId: (id: string) => void;
}

const useSelectedButtonStore = create<State>((set) => ({
  id: "dashboard",
  setId: (id: string) => set({ id }),
}));

export default useSelectedButtonStore;
