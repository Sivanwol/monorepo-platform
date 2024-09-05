import type { DataTableType, Pagination, SortByOpt } from "@app/utils";

export interface FetcherActions {
  clearData: () => void;
  getLoadingState: () => boolean;
  setLoadingState: (status: boolean) => void;
  clearLoadingState: () => void;
  requestData: (
    data: DataTableType[],
    pagination: Pagination,
    sort: SortByOpt | null,
    apiCallback: () => Promise<DataTableType[]>,
  ) => Promise<void>;
}
