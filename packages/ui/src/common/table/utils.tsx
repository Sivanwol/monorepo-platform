import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";

import type {
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
} from "@app/utils";

const columnHelper = createColumnHelper<DataTableType>();
export const buildColumnDef = (
  columns: ColumnTableProps[],
): ColumnDef<DataTableType>[] => {
  return columns.map((column) => {
    return columnHelper.accessor((row) => row[column.id], {
      id: column.id,
      cell: (info) => info.getValue(),
      header: () => <span>{column.title}</span>,
      footer: (props) => props.column.id,
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
      columns: buildColumnDef(column.columns),
    });
  });
};
export const isGroupColumn = (
  column: ColumnGroupTableProps | ColumnTableProps,
): column is ColumnGroupTableProps => {
  return column.group;
};

export const buildCSV = (
  data: DataTableType[],
  columns: ColumnTableProps[] | ColumnGroupTableProps[],
) => {
  const buildHeaders: string[] = [];
  columns.forEach((column) => {
    if (isGroupColumn(column)) {
      column.columns.forEach((col) => {
        buildHeaders.push(col.title);
      });
    } else {
      buildHeaders.push(column.title);
    }
  });
  const rows = data.map((row) => {
    const rowValues: string[] = [];
    columns.forEach((column) => {
      if (isGroupColumn(column)) {
        column.columns.forEach((col) => {
          rowValues.push(row[col.id]?.toString() ?? "");
        });
      } else {
        rowValues.push(row[column.id]?.toString() ?? "");
      }
    });
    return rowValues.join(",");
  });
  return [buildHeaders.join(","), ...rows].join("\n");
};

export const downloadCsv = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
