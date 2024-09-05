"use client";

import React, { useCallback, useEffect } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";

import type { DataTableType, SortByOpt, UserTestPageProps, Pagination } from "@app/utils";
import { TableWarp } from "@app/ui";
import { mockData, rowsPerPageOptions } from "@app/utils";

export const TableTest = ({
  lng,
  ns,
  columns,
  translations,
}: UserTestPageProps) => {
  const [data, setData] = React.useState<DataTableType[]>([]);
  const [sortBy, setSortBy] = React.useState<SortByOpt | null>(null);
  const [pagination, setPagination] = React.useState<Pagination>({ page: 1, pageSize: rowsPerPageOptions[0] ?? 20, totalEntries: 0 });

  const fetcher = useCallback(async () => {
    setData(mockData(100).map((item) => ({ ...item }) as DataTableType));
    console.log("update data etcher", { data, sortBy, pagination });
  }, [setData]);
  useEffect(() => {
    if (data.length === 0) {
      fetcher().catch(console.error);
    }
  }, [lng, ns, data, setData, fetcher, sortBy, pagination]);
  const onSort = (sort: SortByOpt | null) => {
    if (!sort && sortBy) {
      console.log("sort changed", sort);
      setSortBy(null);
      return;
    }
    if (sort) {
      if (
        !sortBy ||
        sortBy.columnId !== sort.columnId ||
        sortBy.direction !== sort.direction
      ) {
        console.log("sort changed", sort);
        setSortBy(null);
        fetcher().catch(console.error);
      }
    }
  };
  const onPagination = (page: number, rowsPerPage: number) => {
    if (pagination.page === page && pagination.pageSize === rowsPerPage) return;
    console.log("pagination changed", { page, rowsPerPage });
    setPagination({ page, pageSize: rowsPerPage, totalEntries: data.length });
  };
  const onReloadData = () => {
    fetcher().catch(console.error);
  };
  const renderPage = (
    <TableWarp
      data={data}
      onPagination={onPagination}
      onSort={onSort}
      columns={columns}
      pagination={pagination}
      sort={sortBy}
      translations={translations}
      onReloadDataFn={onReloadData}
      enableExport={true}
      enableSelection={true}
      enableSorting={true}
      rowActions={[
        {
          title: "Edit",
          icon: <MdModeEdit />,
          onClickEvent: (row: DataTableType) => console.log("Edit", row),
        },
        {
          title: "Delete",
          icon: <MdDelete />,
          onClickEvent: (row: DataTableType) => console.log("Delete", row),
        },
      ]}
      direction="rtl"
      resize={{ minWidth: 50, maxWidth: 200 }}
      debugMode={false}
    />
  );
  return renderPage;
};
