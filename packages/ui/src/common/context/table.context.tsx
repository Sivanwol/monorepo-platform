"use client";

import type { ReactNode } from "react";
import React, { createContext, useCallback, useMemo, useState } from "react";

import type { DataTableType, Pagination, SortByOpt } from "@app/utils";
import { rowsPerPageOptions } from "@app/utils";

// Define types for your context value
export interface TableContextType {
  data: DataTableType[];
  sortBy: SortByOpt | null;
  pagination: Pagination;
  setSort: (sort: SortByOpt) => void;
  clearSort: () => void;
  setPage: (page: number, rowsPerPage: number) => void;
  setTableData: (data: DataTableType[]) => void;
  setData: (data: DataTableType[]) => void;
}

export const TableContextMap = new Map<
  string,
  React.Context<TableContextType | undefined>
>();

export const TableProvider: React.FC<{
  children: ReactNode;
  tableId: string;
}> = ({ children, tableId }) => {
  const [sortBy, setSortBy] = useState<SortByOpt | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: rowsPerPageOptions[0] ?? 20, // Provide a default value (e.g., 20)
    totalEntries: 0,
  });
  const [dataTable, setDataTable] = useState<DataTableType[]>([]);

  const setSort = useCallback(
    (sort: SortByOpt) => {
      if (
        sort.columnId === sortBy?.columnId &&
        sort.direction === sortBy.direction
      )
        return;
      setPagination({
        page: 1,
        pageSize: pagination.pageSize,
        totalEntries: pagination.totalEntries,
      });
      setSortBy(sort);
    },
    [sortBy, setPagination, pagination, setSortBy],
  );

  const clearSort = useCallback(() => {
    if (!sortBy) return;
    setPagination({
      page: 1,
      pageSize: pagination.pageSize,
      totalEntries: pagination.totalEntries,
    });
    setSortBy(null);
  }, [sortBy, setPagination, pagination, setSortBy]);

  const setTableData = useCallback(
    (data: DataTableType[]) => {
      setDataTable(data);
    },
    [setDataTable],
  );

  const setPage = useCallback(
    (page: number, rowsPerPage: number) => {
      if (pagination.page === page && pagination.pageSize === rowsPerPage)
        return;
      setPagination({
        page,
        pageSize: rowsPerPage,
        totalEntries: pagination.totalEntries,
      });
    },
    [pagination, setPagination],
  );

  const setData = useCallback(
    (data: DataTableType[]) => {
      setPagination({
        page: 1,
        pageSize: pagination.pageSize,
        totalEntries: data.length,
      });
      setSortBy(null);
      setDataTable(data);
    },
    [pagination, setSortBy, setDataTable, setPagination],
  );

  const value: TableContextType = useMemo(
    () => ({
      data: dataTable,
      sortBy,
      pagination,
      setData,
      setSort,
      clearSort,
      setPage,
      setTableData,
    }),
    [
      dataTable,
      sortBy,
      pagination,
      setData,
      setSort,
      clearSort,
      setPage,
      setTableData,
    ],
  );

  if (!TableContextMap.has(tableId)) {
    TableContextMap.set(
      tableId,
      createContext<TableContextType | undefined>(undefined),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const TableContext = TableContextMap.get(tableId)!;

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
