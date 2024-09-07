"use client";

import React, { cache, useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";

import type { TableState, TableStore } from "@app/store-backoffice";
import type {
  DataTableType,
  Pagination,
  SortByOpt,
  UserPageProps,
} from "@app/utils";
import { useTableStore } from "@app/store-backoffice";
import { TableWarp } from "@app/ui";

import { api } from "../../../trpc/react";

export const UserHistoryTable = ({
  userId,
  lng,
  ns,
  columns,
  translations,
}: UserPageProps) => {
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
      await utils.user.securityAudit.invalidate();
      const res = await utils.user.securityAudit.fetch(userId);
      return {
        entities: res?.map((item) => item as unknown as DataTableType) ?? [],
        total: res?.length ?? 0,
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
      enableExport={false}
      enableSelection={false}
      enableSorting={false}
      rowActions={[]}
      direction="rtl"
      resize={{ minWidth: 50, maxWidth: 200 }}
      debugMode={false}
    />
  );
  return tableId && tableReady ? renderPage : null;
};
