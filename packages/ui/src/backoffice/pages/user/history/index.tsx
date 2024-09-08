"use client";

import React from "react";
import { Box } from "@mui/material";

import type { UserPageProps } from "@app/utils";

import { UserHistoryTable } from "./userHistoryTable";
import { TRPCReactProvider } from "../../../trpc/react";
import { AuthProvider } from "@descope/nextjs-sdk";

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
