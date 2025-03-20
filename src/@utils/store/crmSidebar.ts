import { create } from "zustand";

interface State {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

const useCrmSidebarStore = create<State>((set) => ({
  isExpanded: true,
  setIsExpanded: (isExpanded) => set({ isExpanded }),
}));

export default useCrmSidebarStore;
