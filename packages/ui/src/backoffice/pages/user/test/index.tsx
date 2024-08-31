"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";

import type { DataTableType, UserTestPageProps } from "@app/utils";
import { LoadingSpinner, Table } from "@app/ui";
import { initTranslation, mockData, t } from "@app/utils";

export const UserTestPage = ({ lng, ns, columns }: UserTestPageProps) => {
  const [translationsLoaded, setTranslationsLoaded] = useState(false);
  const [data, setData] = useState<DataTableType[]>([]);
  useEffect(() => {
    if (!translationsLoaded) {
      const fetcher = async () => {
        await initTranslation(lng);
        setData(mockData(100).map((item) => ({ ...item }) as DataTableType));
      };
      fetcher()
        .catch(console.error)
        .finally(() => {
          setTranslationsLoaded(true);
        });
    }
  }, [ns, translationsLoaded, setTranslationsLoaded]);
  const onReloadData = () => {
    setData(mockData(100).map((item) => ({ ...item }) as DataTableType));
  };
  const translations = {
    all: t(ns, "all"),
    title: t(ns, "title"),
    rawPerPage: t(ns, "rawPerPage"),
    actions: t(ns, "actions"),
    reload: t(ns, "reload"),
  };
  console.log(`loading ${lng}-${ns}`, translationsLoaded);
  const renderPage = (
    <Box sx={{ width: "100%" }}>
      <Table
        columns={columns}
        data={data}
        title={translations.title}
        translations={translations}
        onReloadDataFn={onReloadData}
      />
    </Box>
  );
  return translationsLoaded ? renderPage : <LoadingSpinner />;
};
