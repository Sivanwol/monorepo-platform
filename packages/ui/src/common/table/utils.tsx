import type { ColumnDef, SortingState } from "@tanstack/react-table";
import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";

import type {
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
  RowActionsTableItem,
  TranslationRecord,
} from "@app/utils";

import type { SoftByRow } from "../context";
import { SortByDirection } from "../context";
import { IndeterminateCheckbox } from "./indeterminateCheckbox";

const columnHelper = createColumnHelper<DataTableType>();

const rowButtonRenderer = (
  rowActions: RowActionsTableItem[],
  translations: TranslationRecord,
  row: DataTableType,
) => (
  <ButtonGroup
    size="large"
    variant="outlined"
    aria-label={translations.rowActions}
  >
    {rowActions.map((action, index) => (
      <Button
        variant="outlined"
        key={"button_" + index}
        startIcon={action.icon}
        className="ml-3 mr-3"
        onClick={() => action.onClickEvent(row)}
      >
        {action.title}
      </Button>
    ))}
  </ButtonGroup>
);

export const buildColumnDef = (
  columns: ColumnTableProps[],
  translations: TranslationRecord,
  rowActions?: RowActionsTableItem[],
): ColumnDef<DataTableType>[] => {
  console.log("columns", columns);
  console.log("rowActions", rowActions);
  const columnMap: Record<string, boolean> = {};
  return columns
    .map((column) => {
      if (columnMap[column.id]) return null;
      columnMap[column.id] = true;

      if (column.id === "select") {
        return columnHelper.accessor((row) => row[column.id], {
          id: "select",
          enableResizing: false,
          size: 40,
          header: ({ table }) => (
            <IndeterminateCheckbox
              key={`select_all`}
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({ row }) => (
            <div className="px-1">
              <IndeterminateCheckbox
                key={`select_${row.id}`}
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          ),
        }) as ColumnDef<DataTableType>;
      }
      if (column.type === "internal" && rowActions) {
        return columnHelper.accessor((row) => row[column.id], {
          id: column.id,
          enableResizing: false,
          cell: (info) =>
            rowButtonRenderer(rowActions, translations, info.row.original),
          header: () => <span>{translations.rowActions}</span>,
          footer: (props) => props.column.id,
        }) as ColumnDef<DataTableType>;
      } else {
        if (column.type !== "internal") {
          return columnHelper.accessor((row) => row[column.id], {
            id: column.id,
            enableResizing: true,
            cell: (info) => info.getValue(),
            header: () => <span>{column.title}</span>,
            footer: (props) => props.column.id,
          }) as ColumnDef<DataTableType>;
        }
      }
    })
    .filter((element): element is ColumnTableProps => !!element);
};
export const buildGroupColumnDef = (
  columns: ColumnGroupTableProps[],
  translations: TranslationRecord,
  rowActions?: RowActionsTableItem[],
): ColumnDef<DataTableType>[] => {
  return columns.map((group) => {
    return columnHelper.group({
      id: group.id,
      header: group.title,
      columns: buildColumnDef(group.columns, translations, rowActions),
    });
  });
};
export const isGroupColumn = (
  column: ColumnGroupTableProps | ColumnTableProps,
): column is ColumnGroupTableProps => {
  return column.group;
};
export const filterColumn = (columnId: string) =>
  columnId !== "select" && columnId !== "rowActions";
export const getHeaderFromColumn = (
  columnId: string,
  headers: ColumnTableProps[] | ColumnGroupTableProps[],
) => {
  const firstColumn = headers[0];
  if (headers.length > 0 && firstColumn) {
    for (const header of headers) {
      if (isGroupColumn(header)) {
        const column = header.columns.find((col) => col.id === columnId);
        if (column) {
          return column;
        }
      } else {
        if (header.id === columnId) {
          return header;
        }
      }
    }
  }
  return null;
};
export const buildCSV = (
  data: DataTableType[],
  columns: ColumnTableProps[] | ColumnGroupTableProps[],
) => {
  const buildHeaders: string[] = [];
  columns.forEach((column) => {
    if (isGroupColumn(column)) {
      column.columns
        .filter((c) => filterColumn(c.id))
        .forEach((col) => {
          buildHeaders.push(col.title);
        });
    } else {
      if (filterColumn(column.id)) {
        buildHeaders.push(column.title);
      }
    }
  });
  const rows = data.map((row) => {
    const rowValues: string[] = [];
    columns.forEach((column) => {
      if (isGroupColumn(column)) {
        column.columns
          .filter((c) => filterColumn(c.id))
          .forEach((col) => {
            rowValues.push(row[col.id]?.toString() ?? "");
          });
      } else {
        if (filterColumn(column.id)) {
          rowValues.push(row[column.id]?.toString() ?? "");
        }
      }
    });
    console.log("rowValues", rowValues);
    return rowValues.join(",");
  });
  console.log("rows", rows);
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

export function isObjectEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

export function convertSortBy(sortBy: SoftByRow | null): SortingState {
  if (sortBy) {
    return [
      {
        id: sortBy.columnId,
        desc: sortBy.direction === SortByDirection.DESC,
      },
    ];
  }
  return [];
}
