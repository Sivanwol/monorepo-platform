"use client";

import { useContext } from "react";

import type { SortByContextType } from "../context";
import { SortByContext } from "../context";

export function useSort(): SortByContextType {
  const context = useContext(SortByContext);
  if (context === undefined) {
    throw new Error("useSort must be used within a SortByProvider");
  }
  return context;
}
