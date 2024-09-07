"use client";

import React, { cache, useEffect, useState } from "react";
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

import { api } from "../../../trpc/react";

export const TableTest = ({
  lng,
  ns,
  columns,
  translations,
}: UserTestPageProps) => {
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableReady, setTableReady] = useState<boolean>(false);

  const utils = api.useUtils();
  const { setData, hasData, tables, init, setLoading } =
    useTableStore<TableStore>((store) => store as TableStore);
  const { pagination, sort } = tableId
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    tables[tableId]!
    : ({} as TableState);
  useEffect(() => {
    const fetcher = async () => {
      await utils.mock.mockData.invalidate();
      const res = await utils.mock.mockData.fetch({ total: 100 });
      return {
        entities: res.entities,
        total: res.total,
      };
    };

    if (!tableId && !tableReady) {
      fetcher()
        .then((data) => {
          const id = init({
            data: data.entities,
            onPagination: async (pagination: Pagination | null) => {
              const data = await fetcher();
              console.log("pagination change reload data", {
                data,
                sort,
                pagination,
              });
              return data.entities;
            },
            onSort: async (sort: SortByOpt | null) => {
              const data = await fetcher();
              console.log("sort change reload data", {
                data,
                sort,
                pagination,
              });
              return data.entities;
            },
            onReload: async () => {
              const data = await fetcher();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setData(tableId!, data.entities, data.total);
              console.log("reload data", { data, sort, pagination });
              return data.entities;
            },
          });
          setTableReady(true);
          setTableId(id);
        })
        .catch(console.error);
    }
  }, [tableId, init, sort, pagination, utils, setData, setLoading, tableReady]);

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
