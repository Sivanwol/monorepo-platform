"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";

import type { TableState, TableStore } from "@app/store-backoffice";
import type {
  DataTableType,
  Pagination,
  SortByOpt,
  UserTestPageProps,
} from "@app/utils";
import { useTableStore } from "@app/store-backoffice";
import { TableWarp } from "@app/ui";
import { mockData } from "@app/utils";

export const TableTest = ({
  lng,
  ns,
  columns,
  translations,
}: UserTestPageProps) => {
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableReady, setTableReady] = useState<boolean>(false);
  const [currentPagination, setCurrentPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    totalEntries: 0,
  });
  const [currentSort, setCurrentSort] = useState<SortByOpt | null>(null);
  const { setData, hasData, tables, init, bindRequestReload } =
    useTableStore<TableStore>((store) => store as TableStore);
  const { pagination, sort } = tableId
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tables[tableId]!
    : ({} as TableState);
  const fetcher = useCallback(async () => {
    const data = mockData(100).map((item) => ({ ...item }) as DataTableType);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setData(tableId!, data);
    console.log("update data etcher", { data, sort, pagination });
  }, [tableId, setData, sort, pagination]);
  useEffect(() => {
    if (!tableId) {
      const id = init({
        requestReloadCb: async () => {
          const data = mockData(100).map(
            (item) => ({ ...item }) as DataTableType,
          );
          console.log("update data etcher", { data, sort, pagination });
          return data;
        }
      });
      setTableId(id);
      fetcher()
        .catch(console.error)
        .finally(() => {
          setTableReady(true);
        });
    }
  }, [tableId, init, bindRequestReload, sort, pagination, fetcher]);

  useEffect(() => {
    if (!tableId) return;
    if (
      currentPagination.page !== pagination.page ||
      currentPagination.pageSize !== pagination.pageSize
    ) {
      fetcher()
        .catch(console.error)
        .finally(() => {
          setCurrentPagination(pagination);
        });
    }
    if (
      !currentSort !== !!currentSort ||
      currentSort?.columnId !== sort?.columnId ||
      currentSort?.direction !== sort?.direction
    ) {
      fetcher()
        .catch(console.error)
        .finally(() => {
          setCurrentSort(sort);
        });
    }
  }, [tableId, pagination, sort, currentPagination, currentSort, fetcher]);
  const renderPage = (
    <TableWarp
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tableId={tableId!}
      columns={columns}
      translations={translations}
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
  return tableId && tableReady ? renderPage : null;
};
