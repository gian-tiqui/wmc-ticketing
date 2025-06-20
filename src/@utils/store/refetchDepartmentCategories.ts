import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Category } from "../../types/types";
import { create } from "zustand";

interface State {
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Category>, Error>>;
  setRefetch: (
    refetch: (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<Category>, Error>>
  ) => void;
}

const useRefetchCategoriesStore = create<State>((set) => ({
  refetch: undefined,
  setRefetch: (ref) => set({ refetch: ref }),
}));

export default useRefetchCategoriesStore;
