import { create } from "zustand";
import { UserData } from "../../types/types";
import extractUserData from "../functions/extractUserData";

interface State {
  user: UserData | undefined;
  setUser: (user: UserData) => void;
  remove: () => void;
}

const useUserDataStore = create<State>((set) => ({
  user: extractUserData(),
  setUser: (user: UserData) => set({ user }),
  remove: () => set({ user: undefined }),
}));

export default useUserDataStore;
