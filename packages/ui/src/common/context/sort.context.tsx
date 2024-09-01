"use client";

import type { ReactNode } from "react";
import React, { createContext, useState } from "react";

import type { DataTableType } from "@app/utils";

export enum SortByDirection {
  ASC = "asc",
  DESC = "desc",
}
// Define types for your context value
export interface SortByContextType {
  sortBy: SoftByRow | null;
  UpdateSortBy: (sort: SoftByRow) => void;
  ResetSortBy: (columnId: string) => void;
}
export interface SoftByRow {
  row: DataTableType;
  columnId: string;
  direction: SortByDirection;
}
export const SortByContext = createContext<SortByContextType | undefined>(
  undefined,
);

export const SortByProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sortBy, setSortBy] = useState<SoftByRow | null>(null);

  const UpdateSortBy = (sort: SoftByRow) => {
    setSortBy(sort);
  };

  const ResetSortBy = (columnId: string) => {
    if (sortBy && sortBy.columnId === columnId) {
      setSortBy(null);
    }
  };

  const value: SortByContextType = {
    sortBy,
    UpdateSortBy,
    ResetSortBy,
  };

  return (
    <SortByContext.Provider value={value}>{children}</SortByContext.Provider>
  );
};
