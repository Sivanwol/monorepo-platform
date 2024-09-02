"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { MdDelete, MdModeEdit } from "react-icons/md";

import type { DataTableType, UserTestPageProps } from "@app/utils";
import { LoadingSpinner, Table, useTable } from "@app/ui";
import { mockData } from "@app/utils";

export const UserTestPage = ({
  lng,
  ns,
  columns,
  translations,
}: UserTestPageProps) => {
  const { data, sortBy, pagination, setData } = useTable();
  const [loading, setLoading] = useState(false);

  const fetcher = useCallback(async () => {
    setData(mockData(100).map((item) => ({ ...item }) as DataTableType));
    setLoading(false);
  }, [setData, setLoading]);
  useEffect(() => {
    console.log("load new data", data, sortBy, pagination);
    if (data.length === 0) {
      setLoading(true);
      fetcher().catch(console.error);
    }
  }, [lng, ns, data, sortBy, pagination, setData, fetcher, setLoading]);

  console.log("external sortBy", sortBy);
  const onReloadData = () => {
    setLoading(true);
    fetcher().catch(console.error);
  };
  const renderPage = (
    <Box sx={{ width: "100%" }}>
      <Table
        columns={columns}
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
    </Box>
  );
  return !loading ? renderPage : <LoadingSpinner />;
};
