import { create } from "zustand";

interface State {
  hasSecret: boolean;
  setHasSecret: (hasSecret: boolean) => void;
}

const useHasSecretStore = create<State>((set) => ({
  hasSecret: true,
  setHasSecret: (hasSecret: boolean) => set({ hasSecret }),
}));

export default useHasSecretStore;
