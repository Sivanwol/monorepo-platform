"use client";

import React from "react";
import { AuthProvider } from "@descope/nextjs-sdk";
import { Box } from "@mui/material";

import type { UserPageProps } from "@app/utils";

import { TRPCReactProvider } from "../../../trpc/react";
import { UserHistoryTable } from "./userHistoryTable";

export const UserHistoryPage = ({
  userId,
  lng,
  ns,
  columns,
  translations,
}: UserPageProps) => {
  const renderPage = (
    <TRPCReactProvider>
      <Box sx={{ width: "100%" }}>
        <UserHistoryTable
          userId={userId}
          lng={lng}
          ns={ns}
          columns={columns}
          translations={translations}
        />
      </Box>
    </TRPCReactProvider>
  );
  return renderPage;
};
