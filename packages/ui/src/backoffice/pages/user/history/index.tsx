"use client";

import React from "react";
import { Box } from "@mui/material";

import type { UserHistoryPageProps } from "@app/utils";

import { UserHistoryTable } from "./userHistoryTable";

export const UserHistoryPage = ({
  totalRecords,
  data,
  userId,
  lng,
  ns,
  columns,
  translations,
}: UserHistoryPageProps) => {
  const renderPage = (
    <Box sx={{ width: "100%" }}>
      <UserHistoryTable
        userId={userId}
        data={data}
        totalRecords={totalRecords}
        lng={lng}
        ns={ns}
        columns={columns}
        translations={translations}
      />
    </Box>
  );
  return renderPage;
};
