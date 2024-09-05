import { createContext } from "react";
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'

import type { DataTableType, Pagination, SortByOpt } from "@app/utils";
import { rowsPerPageOptions } from "@app/utils";

import type { FetcherActions } from "./actions";

export interface FetcherState {
  data: DataTableType[];
  status: boolean;
  loading: boolean;
  errorMessages?: string;
  metadata: {
    sort: SortByOpt | null;
    pagination: Pagination;
  };
}
export type FetcherStore = FetcherState & FetcherActions;
export const defaultFetcherState: FetcherState = {
  data: [],
  status: false,
  loading: false,
  errorMessages: undefined,
  metadata: {
    sort: null,
    pagination: {
      page: 1,
      pageSize: rowsPerPageOptions[0] ?? 0,
      totalEntries: 0,
    },
  },
};

export const createFetcherStore = (
  initialState: FetcherState = defaultFetcherState,
) =>
  createStore<FetcherStore>()(devtools((set, get) => ({
    ...initialState,
    clearData: () => set((state) => ({ data: [] })),
    getLoadingState: () => get().loading,
    setLoadingState: (status: boolean) => set((state) => ({ loading: status })),
    clearLoadingState: () => set((state) => ({ loading: false })),
    requestData: async (
      data: DataTableType[],
      pagination: Pagination,
      sort: SortByOpt | null,
      apiCallback: () => Promise<DataTableType[]>,
    ): Promise<void> => {
      if (get().loading) throw new Error("Request already in progress");
      set((state) => ({
        loading: true,
        errorMessages: undefined,
        status: false,
      }));
      try {
        const response = await apiCallback();
        set((state) => ({
          data: response,
          loading: false,
          status: true,
          errorMessages: undefined,
          metadata: {
            sort,
            pagination: {
              page: 1,
              pageSize: pagination.pageSize,
              totalEntries: response.length,
            },
          },
        }));
      } catch (error) {
        set((state) => ({
          loading: false,
          errorMessages: (error as Error).message,
          status: false,
        }));
      }
    },
  })));

export const FetcherStoreContext = createContext<
  ReturnType<typeof createFetcherStore> | undefined
>(undefined);
