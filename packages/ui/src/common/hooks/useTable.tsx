"use client";

import { useContext } from "react";

import type { TableContextType } from "../context";
import { TableContext } from "../context";

export function useTable(): TableContextType {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
}
