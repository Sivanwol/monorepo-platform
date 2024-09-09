"use client";

import React, { useEffect, useState } from "react";
import { getSessionToken, useSession } from "@descope/react-sdk";
import { useQuery } from "@tanstack/react-query";

import type { TableState, TableStore } from "@app/store-backoffice";
import type {
  DataTableType,
  Pagination,
  UserAuditInfo,
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
  const { sessionToken, isAuthenticated } = useSession();

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: ["userHistorySecurity", { userId }],
    queryFn: async ({ queryKey }) => {
      const [_, { userId }] = queryKey as [string, { userId: number }];
      const bearer = "Bearer " + sessionToken;
      const res = await fetch(`/api/user/security/${userId}`, {
        headers: {
          Authorization: getSessionToken(),
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as {
        entities: DataTableType[];
        total: number;
      };
      return data;
    },
    // eslint-disable-next-line no-constant-binary-expression
    enabled: false && isAuthenticated,
  });

  const utils = api.useUtils();
  const { setData, hasData, tables, init, setLoading } =
    useTableStore<TableStore>((store) => store as TableStore);
  const { pagination, sort } = tableId
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tables[tableId]!
    : ({} as TableState);
  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    if (!tableId && !tableReady) {
      refetch()
        .then((res) => {
          const { data, error } = res;
          const entities = data?.entities ?? [];
          console.log(`fetch data`, { entities, error });
          const id = init({
            data: entities,
            totalEntities: data?.total ?? 0,
            onPagination: async (pagination: Pagination | null) => {
              setLoading(tableId!, true);
              const res = await refetch();
              const { data, error } = res;
              const entities = data?.entities ?? [];
              console.log("fetch data", { tableId, data, error });
              if (error || !data) {
                throw Error("Failed to fetch data");
              }
              console.log("pagination change reload data", {
                data,
                sort,
                pagination,
              });
              setData(tableId!, entities, data.total);
              setLoading(tableId!, false);
              return data.entities;
            },
            onReload: async () => {
              setLoading(tableId!, true);
              const res = await refetch();
              const { data, error } = res;
              const entities = data?.entities ?? [];
              console.log("fetch data", { tableId, data, error });
              if (error || !data) {
                throw Error("Failed to fetch data");
              }

              setData(tableId!, entities, data.total);
              console.log("reload data", { data, sort, pagination });
              setLoading(tableId!, false);
              return data.entities;
            },
          });
          setTableId(id);
          setTableReady(true);
        })
        .catch(console.error);
    }
  }, [
    tableId,
    init,
    sort,
    pagination,
    utils,
    setData,
    setLoading,
    tableReady,
    userId,
    isAuthenticated,
    refetch,
  ]);

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
      debugMode={true}
    />
  );
  return tableId && tableReady ? renderPage : null;
};
