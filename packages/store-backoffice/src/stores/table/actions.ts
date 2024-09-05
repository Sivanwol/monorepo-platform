import type { DataTableType, Pagination, SortByOpt } from "@app/utils";

export interface TableActions {
  setData: (data: DataTableType[]) => void;
  setPagination: (pagination: Pagination) => void;
  setSort(sort: SortByOpt | null): void;
  reset: () => void;
}
