"use client";

import { useMemo, useRef } from "react";

import type { TableWarpProps } from "@app/utils";

import { TableBuilder } from ".";

export const TableWarp: React.FC<TableWarpProps> = ({
  tableId,
  children,
  translations,
  columns,
  actions,
  enableExport,
  enableFilters,
  enableSelection,
  enableSorting,
  resize,
  direction,
  rowActions,
  debugMode,
}: TableWarpProps) => {
  // Memoize the props to prevent unnecessary re-renders
  const _memoizedProps = useMemo(
    () => ({
      translations,
      columns,
      actions,
      enableExport,
      enableFilters,
      enableSelection,
      enableSorting,
      resize,
      direction,
      rowActions,
      debugMode,
    }),
    [
      translations,
      columns,
      actions,
      enableExport,
      enableFilters,
      enableSelection,
      enableSorting,
      resize,
      direction,
      rowActions,
      debugMode,
    ],
  );

  const table = useMemo(() => {
    return (
      <TableBuilder
        tableId={tableId}
        columns={_memoizedProps.columns}
        actions={_memoizedProps.actions}
        translations={_memoizedProps.translations}
        enableExport={_memoizedProps.enableExport}
        enableSelection={_memoizedProps.enableSelection}
        enableSorting={_memoizedProps.enableSorting}
        enableFilters={_memoizedProps.enableFilters}
        rowActions={_memoizedProps.rowActions}
        direction={_memoizedProps.direction}
        resize={_memoizedProps.resize}
        debugMode={_memoizedProps.debugMode}
      />
    );
  }, [_memoizedProps, tableId]);

  return (
    <>
      {children}
      {table}
    </>
  );
};
