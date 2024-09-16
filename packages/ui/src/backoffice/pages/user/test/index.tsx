"use client";

import React from "react";
import { Box } from "@mui/material";

import type { UserTestPageProps } from "@app/utils";

import { TableTest } from "./tableTest";

export const UserTestPage = ({
  lng,
  ns,
  columns,
  translations,
}: UserTestPageProps) => {
  const renderPage = (
    <Box sx={{ width: "100%" }}>
      <TableTest
        lng={lng}
        ns={ns}
        columns={columns}
        translations={translations}
      />
      {/* <TableTest
        lng={lng}
        ns={ns}
        columns={columns}
        translations={translations}
      /> */}
    </Box>
  );
  return renderPage;
};
