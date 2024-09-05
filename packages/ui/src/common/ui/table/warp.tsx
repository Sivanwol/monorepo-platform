"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidV4 } from "uuid";

import type { TableWarpProps } from "@app/utils";

import { TableBuilder } from ".";
import { TableProvider } from "../../context";
import { useTable } from "../../hooks";

interface TableWarpInnerProps extends TableWarpProps {
  tableId: string;
}

export const TableWarp: React.FC<TableWarpProps> = ({
  children,
  data,
  onPagination,
  onSort,
  translations,
  columns,
  actions,
  pagination,
  sort,
  enableExport,
  enableFilters,
  enableSelection,
  enableSorting,
  onReloadDataFn,
  onExportFn,
  resize,
  direction,
  rowActions,
  debugMode,
}: TableWarpProps) => {
  const tableRef = useRef<string>(uuidV4());
  const tableId = useMemo(() => tableRef.current, [tableRef]);

  // Memoize the props to prevent unnecessary re-renders
  const memoizedProps = useMemo(
    () => ({
      data,
      onPagination,
      onSort,
      translations,
      columns,
      actions,
      pagination,
      sort,
      enableExport,
      enableFilters,
      enableSelection,
      enableSorting,
      onReloadDataFn,
      onExportFn,
      resize,
      direction,
      rowActions,
      debugMode,
    }),
    [
      data,
      onPagination,
      onSort,
      translations,
      columns,
      actions,
      pagination,
      sort,
      enableExport,
      enableFilters,
      enableSelection,
      enableSorting,
      onReloadDataFn,
      onExportFn,
      resize,
      direction,
      rowActions,
      debugMode,
    ],
  );

  return (
    <TableProvider tableId={tableId}>
      {children}
      <TableWarpInner tableId={tableId} {...memoizedProps} />
    </TableProvider>
  );
};

const TableWarpInner: React.FC<TableWarpInnerProps> = ({
  tableId,
  data,
  onPagination,
  onSort,
  translations,
  columns,
  actions,
  enableExport,
  enableFilters,
  enableSelection,
  enableSorting,
  onReloadDataFn,
  onExportFn,
  resize,
  direction,
  rowActions,
  debugMode,
}: TableWarpInnerProps) => {
  const { sortBy, pagination, setData } = useTable(tableId);

  // Memoize the onPagination and onSort callbacks
  const memoizedOnData = useCallback(setData, [setData]);
  const memoizedOnPagination = useCallback(onPagination, [onPagination]);
  const memoizedOnSort = useCallback(onSort, [onSort]);

  // Uncomment and use these effects if needed

  useEffect(() => {
    memoizedOnData(data);
  }, [data, memoizedOnData]);
  useEffect(() => {
    memoizedOnPagination(pagination.page, pagination.pageSize);
  }, [memoizedOnPagination, pagination]);
  useEffect(() => {
    memoizedOnSort(sortBy);
  }, [memoizedOnSort, sortBy]);

  return (
    <TableBuilder
      tableId={tableId}
      columns={columns}
      actions={actions}
      translations={translations}
      onReloadDataFn={onReloadDataFn}
      enableExport={enableExport}
      enableSelection={enableSelection}
      enableSorting={enableSorting}
      enableFilters={enableFilters}
      rowActions={rowActions}
      onExportFn={onExportFn}
      direction={direction}
      resize={resize}
      debugMode={debugMode}
    />
  );
};
