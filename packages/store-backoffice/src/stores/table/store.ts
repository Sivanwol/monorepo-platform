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
  exportMode: ExportTableMode;
  requestExportCb?: (data: DataTableType[]) => Promise<void>;
  requestReloadCb?: () => Promise<DataTableType[]>;
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
    pageSize: 10,
    totalEntries: 0,
  },
  sort: null,
  exportMode: ExportTableMode.ClientSide,
  requestExportCb: undefined,
  requestReloadCb: undefined,
};

export const createTableStore = () =>
  createStore<TableStore>()(
    devtools((set, get) => ({
      tables: {},
      init: () => {
        const state = get();
        const tableId = uuidV4();
        if (!state.tables[tableId]) {
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...defaultTableState, tableId },
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
      setData: (tableId, data) => {
        const state = get();
        if (!state.tables[tableId]) {
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...defaultTableState, data },
            },
          }));
        } else {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, data },
            },
          }));
        }
      },
      setPagination: (tableId, pagination) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, pagination: pagination },
            },
          }));
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
      bindRequestExport: (tableId, requestExportCb) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, requestExportCb },
            },
          }));
        }
      },
      requestExport: async (tableId) => {
        const { tables } = get();
        const table = tables[tableId];
        if (
          table?.requestExportCb &&
          table.exportMode === ExportTableMode.ServerSide
        ) {
          await table.requestExportCb(table.data);
        }
      },
      bindRequestReload: (tableId, requestReloadCb) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, requestReloadCb },
            },
          }));
        }
      },
      reload: async (tableId) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          if (tableState.requestReloadCb) {
            set((state) => ({
              tables: {
                ...state.tables,
                [tableId]: { ...tableState, loading: true },
              },
            }));
            try {
              const data = await tableState.requestReloadCb();
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
                      page: 1,
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
      setSort: (tableId, sort) => {
        const state = get();
        if (state.tables[tableId]) {
          const tableState = state.tables[tableId];
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: { ...tableState, sort },
            },
          }));
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
