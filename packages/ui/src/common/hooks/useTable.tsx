"use client";

import React, { useContext, useMemo } from "react";

import type { TableContextType } from "../context";
import { TableContextMap } from "../context";

export const useTable = (tableId: string) => {
  const TableContext = useMemo(() => {
    console.log("tableId", tableId);
    if (!TableContextMap.has(tableId)) {
      TableContextMap.set(
        tableId,
        React.createContext<TableContextType | undefined>(undefined),
      );
    }

    console.log("TableContextMap", TableContextMap);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const TableContext = TableContextMap.get(tableId)!;
    console.log("TableContext", TableContext);
    return TableContext;
  }, [tableId]);
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error(
      `useTable must be used within a TableProvider for tableId "${tableId}"`,
    );
  }
  return context;
};
