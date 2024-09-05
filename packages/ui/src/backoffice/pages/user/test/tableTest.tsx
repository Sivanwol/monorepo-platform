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
  const [initialRequest, setInitialRequest] = useState<boolean>(false);
  const [dataRequest, setDataRequest] = useState<boolean>(false);
  const [currentPagination, setCurrentPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalEntries: 0,
  });
  const [currentSort, setCurrentSort] = useState<SortByOpt | null>(null);
  const { setData, hasData, tables, init, bindRequestReload } =
    useTableStore<TableStore>((store) => store as TableStore);
  const { pagination, sort } = tableId
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tables[tableId]!
    : ({} as TableState);
  useEffect(() => {
    if (!tableId) {
      const id = init();

      bindRequestReload(id, async () => {
        const data = mockData(100).map(
          (item) => ({ ...item }) as DataTableType,
        );
        console.log("update data etcher", { data, sort, pagination });
        return data;
      });
      setTableId(id);
    }
  }, [tableId, init, bindRequestReload, sort, pagination]);
  useEffect(() => {
    if (tableId) {
      const requestNewData = false;
      if (
        currentPagination.page !== pagination.page ||
        currentPagination.pageSize !== pagination.pageSize
      ) {
        setCurrentPagination(pagination);
        setDataRequest(true);
      }
      if (
        !currentSort !== !!currentSort ||
        currentSort?.columnId !== sort?.columnId ||
        currentSort?.direction !== sort?.direction
      ) {
        setCurrentSort(sort);
        setDataRequest(true);
      }
    }
  }, [tableId, pagination, sort, currentPagination, currentSort]);
  const fetcher = useCallback(async () => {
    const data = mockData(100).map((item) => ({ ...item }) as DataTableType);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setData(tableId!, data);

    console.log("update data etcher", { data, sort, pagination });
  }, [tableId, setData, sort, pagination]);
  useEffect(() => {
    if (!tableId) return;
    if ((!initialRequest && !hasData(tableId)) || dataRequest) {
      fetcher()
        .catch(console.error)
        .finally(() => {
          setInitialRequest(true);
          if (dataRequest) {
            setDataRequest(false);
          }
        });
    }
  }, [
    lng,
    ns,
    setData,
    fetcher,
    dataRequest,
    setDataRequest,
    pagination,
    tableId,
    hasData,
    initialRequest,
  ]);

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
  return tableId ? renderPage : null;
};
