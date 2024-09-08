"use client";

import { createContext } from "react";
import { v4 as uuidV4 } from "uuid";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { DataTableType, Pagination, SortByOpt } from "@app/utils";
import { ExportTableMode } from "@app/utils";

import type { TableActions } from "./actions";

export interface TableState {
  tableId: string;
  data: DataTableType[];
  pagination: Pagination;
  loading: boolean;
  sort: SortByOpt | null;
  failedFetch: boolean;
  exportMode: ExportTableMode;
  onExportFn?: (data: DataTableType[]) => Promise<void>;
  onReloadFn?: () => Promise<DataTableType[]>;
  onSortFn?: (sort: SortByOpt | null) => Promise<DataTableType[]>;
  onPaginationFn?: (pagination: Pagination | null) => Promise<DataTableType[]>;
}
export type TableStore = {
  tables: Record<string, TableState>;
} & TableActions;

export const defaultTableState: TableState = {
  tableId: "",
  data: [],
  loading: false,
  pagination: {
    page: 1,
    pageSize: 20,
    totalEntries: 0,
  },
  failedFetch: false,
  sort: null,
  exportMode: ExportTableMode.ClientSide,
  onSortFn: undefined,
  onPaginationFn: undefined,
  onReloadFn: undefined,
  onExportFn: undefined,
};

export const createTableStore = () =>
  createStore<TableStore>()(
    devtools((set, get) => ({
      tables: {},
      init: (params: {
        data?: DataTableType[];
        totalEntities?: number;
        onSort?: (sort: SortByOpt | null) => Promise<DataTableType[]>;
        onPagination?: (
          pagination: Pagination | null,
        ) => Promise<DataTableType[]>;
        onReload?: () => Promise<DataTableType[]>;
        onExport?: (data: DataTableType[]) => Promise<void>;
      }) => {
        const state = get();
        const tableId = uuidV4();
        if (!state.tables[tableId]) {
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: {
                ...defaultTableState,
                tableId,
                pagination: {
                  ...defaultTableState.pagination,
                  totalEntries: params.totalEntities ?? 0,
                },
                data: params.data ?? [],
                onSortFn: params.onSort,
                onPaginationFn: params.onPagination,
                onReloadFn: params.onReload,
                onExportFn: params.onExport,
              },
            },
          }));
        }
        return tableId;
      },
      hasData: (tableId) => {
        const state = get();
        const tableState = state.tables[tableId];
        if (!tableState) return false;
        return tableState.data.length > 0;
      },
      setData: (tableId, data, totalEntities) => {
        const state = get();
        if (!state.tables[tableId]) {
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: {
                ...defaultTableState,
                data,
                loading: false,
                pagination: {
                  ...(state.tables[tableId]?.pagination ??
                    defaultTableState.pagination),
                  totalEntries: totalEntities,
                },
              },
            },
          }));
        } else {
          const tableState = state.tables[tableId];
          tableState.data = data;
          tableState.pagination.totalEntries = totalEntities;
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: {
                ...tableState,
                loading: false,
              },
            },
          }));
        }
      },
      onPagination(tableId, fn) {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, onPaginationFn: fn },
            },
          }));
        }
      },
      setPagination: async (tableId, pagination) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          if (tableState.onPaginationFn) {
            try {
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: { ...tableState, loading: true },
                },
              }));
              const data = await tableState.onPaginationFn(pagination);
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: {
                    ...tableState,
                    loading: false,
                    data,
                    pagination: {
                      ...pagination,
                      totalEntries: data.length,
                    },
                    sort: null,
                  },
                },
              }));
            } catch (e) {
              console.log(e);
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: {
                    ...tableState,
                    loading: false,
                    data: [],
                    pagination: {
                      ...tableState.pagination,
                      totalEntries: 0,
                      page: 1,
                    },
                    sort: null,
                  },
                },
              }));
            }
          } else {
            set((state) => ({
              tables: {
                ...state.tables,
                [tableId]: { ...tableState, pagination: pagination },
              },
            }));
          }
        }
      },
      setExportMode: (tableId, mode) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, exportMode: mode },
            },
          }));
        }
      },
      onExport: (tableId, fn) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, onExportFn: fn },
            },
          }));
        }
      },
      requestExport: async (tableId) => {
        const state = get();
        const table = state.tables[tableId];
        if (
          table?.onExportFn &&
          table.exportMode === ExportTableMode.ServerSide
        ) {
          if (state.tables[tableId]) {
            const tableState = state.tables[tableId];
            set((state) => ({
              tables: {
                ...state.tables,
                [tableId]: { ...tableState, loading: true },
              },
            }));
            await table.onExportFn(table.data);
            set((state) => ({
              tables: {
                ...state.tables,
                [tableId]: { ...tableState, loading: false },
              },
            }));
          }
        }
      },
      onReload: (tableId, fn) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, requestReloadCb: fn },
            },
          }));
        }
      },
      reload: async (tableId) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          if (tableState.onReloadFn) {
            set((state) => ({
              tables: {
                ...state.tables,
                [tableId]: { ...tableState, loading: true },
              },
            }));
            try {
              const data = await tableState.onReloadFn();
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: {
                    ...tableState,
                    loading: false,
                    data,
                    pagination: {
                      ...tableState.pagination,
                      totalEntries: data.length,
                    },
                    sort: null,
                  },
                },
              }));
            } catch (e) {
              console.error(e);
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: {
                    ...tableState,
                    loading: false,
                    data: [],
                    pagination: {
                      ...tableState.pagination,
                      totalEntries: 0,
                      page: 1,
                    },
                    sort: null,
                  },
                },
              }));
            }
          }
        }
      },
      onSort(tableId, fn) {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, onSortFn: fn },
            },
          }));
        }
      },
      setSort: async (tableId, sort) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          if (tableState.onSortFn) {
            try {
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: { ...tableState, loading: true },
                },
              }));
              const data = await tableState.onSortFn(sort);
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: {
                    ...tableState,
                    loading: false,
                    data,
                    pagination: {
                      ...tableState.pagination,
                      totalEntries: data.length,
                    },
                    sort,
                  },
                },
              }));
            } catch (e) {
              console.error(e);
              set((state) => ({
                tables: {
                  ...state.tables,
                  [tableId]: {
                    ...tableState,
                    loading: false,
                    data: [],
                    pagination: {
                      ...tableState.pagination,
                      totalEntries: 0,
                      page: 1,
                    },
                    sort: null,
                  },
                },
              }));
            }
          } else {
            set((state) => ({
              tables: {
                ...state.tables,
                [tableId]: { ...tableState, sort },
              },
            }));
          }
        }
      },
      setLoading: (tableId, loading) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, loading },
            },
          }));
        }
      },
      reset: (tableId) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [tableId]: { ...defaultTableState, tableId },
          },
        })),
    })),
  );

export const TableStoreContext = createContext<
  ReturnType<typeof createTableStore> | undefined
>(undefined);
