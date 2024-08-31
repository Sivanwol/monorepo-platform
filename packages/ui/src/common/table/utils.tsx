import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
} from "@app/utils";

export const buildColumnDef = (
  columns: ColumnTableProps[],
): ColumnDef<DataTableType>[] => {
  return columns.map((column) => {
    return {
      accessorFn: column.title,
      id: column.id,
      cell: (info) => info.getValue(),
      header: () => <span>{column.title}</span>,
      footer: (props) => column.id,
    };
  });
};

export const buildGroupColumnDef = (
  columns: ColumnGroupTableProps[],
): ColumnDef<DataTableType>[] => {
  return columns.map((column) => {
    return {
      accessorFn: column.title,
      id: column.id,
      columns: buildColumnDef(column.columns),
      header: () => <span>{column.title}</span>,
    };
  });
};
