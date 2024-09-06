import type {
  DataTableType,
  ExportTableMode,
  Pagination,
  SortByOpt,
} from "@app/utils";

export interface TableActions {
  init: (params: {
    requestReloadCb?: () => Promise<DataTableType[]>;
    requestExportCb?: (data: DataTableType[]) => Promise<void>;
  }) => string;
  setData: (tableId: string, data: DataTableType[]) => void;
  setPagination: (tableId: string, pagination: Pagination) => void;
  setExportMode: (tableId: string, mode: ExportTableMode) => void;
  hasData: (tableId: string) => boolean;
  bindRequestExport: (
    tableId: string,
    requestExportCb: (data: DataTableType[]) => Promise<void>,
  ) => void;
  bindRequestReload: (
    tableId: string,
    requestReloadCb: () => Promise<DataTableType[]>,
  ) => void;
  requestExport: (tableId: string) => Promise<void>;
  reload: (tableId: string) => Promise<void>;
  setSort: (tableId: string, sort: SortByOpt | null) => void;
  setLoading: (tableId: string, loading: boolean) => void;
  reset: (tableId: string) => void;
}
