import { createContext } from "react";
import { createStore } from "zustand/vanilla";

import type { DataTableType, Pagination, SortByOpt } from "@app/utils";

import type { TableActions } from "./actions";

export interface TableState {
  data: DataTableType[];
  pagination: Pagination;
  sort: SortByOpt | null;
}
export type TableStore = TableState & TableActions;
export const defaultTableState: TableState = {
  data: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalEntries: 0,
  },
  sort: null,
};

export const createTableStore = (
  initialState: TableState = defaultTableState,
) =>
  createStore<TableStore>((set) => ({
    ...initialState,
    setData: (data: DataTableType[]) => set((state) => ({ data })),
    setPagination: (pagination: Pagination) => set((state) => ({ pagination })),
    setSort: (sort: SortByOpt | null) => set((state) => ({ sort })),
    reset: () => set(defaultTableState),
  }));

export const TableStoreContext = createContext<
  ReturnType<typeof createTableStore> | undefined
>(undefined);
