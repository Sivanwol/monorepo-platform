import type { ColumnDef } from "@tanstack/react-table";
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

import { IndeterminateCheckbox } from "./indeterminateCheckbox";

const columnHelper = createColumnHelper<DataTableType>();

const rowButtonRenderer = (
  rowActions: RowActionsTableItem[],
  translations: TranslationRecord,
  row: DataTableType,
) => (
  <ButtonGroup variant="contained" aria-label={translations.rowActions}>
    {rowActions.map((action, index) => (
      <Button
        variant="outlined"
        key={"button_" + index}
        startIcon={action.icon}
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
   
  return columns
    .map((column) => {
      if (column.id === "select") {
        return columnHelper.accessor((row) => row[column.id], {
          id: "select",
          header: ({ table }) => (
            <IndeterminateCheckbox
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
        console.info("rowActions", column, rowActions);
         
        return columnHelper.accessor((row) => row[column.id], {
          id: column.id,
          cell: (info) =>
            rowButtonRenderer(rowActions, translations, info.row.original),
          header: () => <span>{translations.rowActions}</span>,
          footer: (props) => props.column.id,
        }) as ColumnDef<DataTableType>;
      } else {
        if (column.type !== "internal") {
           
          return columnHelper.accessor((row) => row[column.id], {
            id: column.id,
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

export function isObjectEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}
