import { create } from "zustand";
import Cookies from "js-cookie";
import { Namespace } from "../enums/enum";

interface State {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const useLoggedInStore = create<State>((set) => ({
  isLoggedIn:
    localStorage.getItem(Namespace.BASE) !== undefined &&
    Cookies.get(Namespace.BASE) !== undefined,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));

export default useLoggedInStore;
