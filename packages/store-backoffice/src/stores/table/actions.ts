import type {
  DataTableType,
  ExportTableMode,
  Pagination,
  SortByOpt,
} from "@app/utils";

export interface TableActions {
  init: (params: {
    data?: DataTableType[];
    totalEntities?: number;
    onSort?: (sort: SortByOpt | null) => Promise<DataTableType[]>;
    onPagination?: (pagination: Pagination | null) => Promise<DataTableType[]>;
    onReload?: () => Promise<DataTableType[]>;
    onExport?: (data: DataTableType[]) => Promise<void>;
  }) => string;
  setData: (
    tableId: string,
    data: DataTableType[],
    totalEntities: number,
  ) => void;
  setPagination: (tableId: string, pagination: Pagination) => Promise<void>;
  setExportMode: (tableId: string, mode: ExportTableMode) => void;
  hasData: (tableId: string) => boolean;
  onExport: (
    tableId: string,
    fn: (data: DataTableType[]) => Promise<void>,
  ) => void;
  onReload: (tableId: string, fn: () => Promise<DataTableType[]>) => void;
  onSort: (
    tableId: string,
    fn: (sort: SortByOpt | null) => Promise<DataTableType[]>,
  ) => void;
  onPagination: (
    tableId: string,
    fn: (pagination: Pagination | null) => Promise<DataTableType[]>,
  ) => void;
  requestExport: (tableId: string) => Promise<void>;
  reload: (tableId: string) => Promise<void>;
  setSort: (tableId: string, sort: SortByOpt | null) => Promise<void>;
  setLoading: (tableId: string, loading: boolean) => void;
  reset: (tableId: string) => void;
}
