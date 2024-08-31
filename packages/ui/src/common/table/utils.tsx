import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";

import type {
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
} from "@app/utils";

const columnHelper = createColumnHelper<DataTableType>()
export const buildColumnDef = (
  columns: ColumnTableProps[],
): ColumnDef<DataTableType>[] => {
  return columns.map((column) => {
    return columnHelper.accessor(row => row[column.id], {
      id: column.id,
      cell: info => info.getValue(),
      header: () => <span>{column.title}</span>,
      footer: props => props.column.id,
    }) as ColumnDef<DataTableType>;
  });
};

export const buildGroupColumnDef = (
  columns: ColumnGroupTableProps[],
): ColumnDef<DataTableType>[] => {
  return columns.map((column) => {
    return columnHelper.group({
      id: column.id,
      header: column.title,
      columns: buildColumnDef(column.columns)
    });
  });
};
export const isGroupColumn = (column: ColumnGroupTableProps | ColumnTableProps): column is ColumnGroupTableProps => {
  return column.group;
};
