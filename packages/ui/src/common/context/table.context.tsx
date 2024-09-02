"use client";

import type { ReactNode } from "react";
import React, { createContext, useState } from "react";

import type { DataTableType, Pagination, SoftByRow } from "@app/utils";
import { rowsPerPageOptions } from "@app/utils";

// Define types for your context value
export interface TableContextType {
  data: DataTableType[];

  sortBy: SoftByRow | null;
  pagination: Pagination;
  setSort: (sort: SoftByRow) => void;
  clearSort: () => void;
  setPage: (page: number, rowsPerPage: number) => void;
  setTableData: (data: DataTableType[]) => void;
  setData: (data: DataTableType[]) => void;
}
export const TableContext = createContext<TableContextType | undefined>(
  undefined,
);

export const TableProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sortBy, setSortBy] = useState<SoftByRow | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    pageSize: rowsPerPageOptions[0]!,
    totalEntries: 0,
  });
  const [dataTable, setDataTable] = useState<DataTableType[]>([]);
  const setSort = (sort: SoftByRow) => {
    console.log("setSort", sort, sortBy);
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
  };
  const clearSort = () => {
    if (!sortBy) return;
    console.log("clearSort", sortBy);
    setPagination({
      page: 1,
      pageSize: pagination.pageSize,
      totalEntries: pagination.totalEntries,
    });
    setSortBy(null);
  };
  const setTableData = (data: DataTableType[]) => {
    setData(data);
  };

  const setPage = (page: number, rowsPerPage: number) => {
    if (pagination.page === page && pagination.pageSize === rowsPerPage) return;
    console.log("setPage", page, rowsPerPage, pagination);
    setPagination({
      page,
      pageSize: rowsPerPage,
      totalEntries: pagination.totalEntries,
    });
  };

  const setData = (data: DataTableType[]) => {
    console.log("setData", data);
    setPagination({
      page: 1,
      pageSize: pagination.pageSize,
      totalEntries: data.length,
    });
    setSortBy(null);
    setDataTable(data);
  };

  const value: TableContextType = {
    data: dataTable,
    sortBy,
    pagination,
    setData,
    setSort,
    clearSort,
    setPage,
    setTableData,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
