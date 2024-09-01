"use client";

import { useContext } from "react";

import { SortByContext, SortByContextType } from "../context";

export function useSort(): SortByContextType {
  const context = useContext(SortByContext);
  if (context === undefined) {
    throw new Error("useSort must be used within a SortByProvider");
  }
  return context;
}
