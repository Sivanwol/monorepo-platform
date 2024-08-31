"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useReducer } from "react";
import { Button, styled } from "@mui/material";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CSVDownload } from "react-csv";
import { CgExport } from "react-icons/cg";
import { TfiReload } from "react-icons/tfi";

import type {
  ActionsTableItem,
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
  TableCommonProps,
} from "@app/utils";

import { Filter } from "./filter";
import { TablePaginating } from "./pageing";
import {
  buildColumnDef,
  buildCSV,
  buildGroupColumnDef,
  downloadCsv,
  isGroupColumn,
} from "./utils";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export const Table = ({
  translations,
  title,
  data,
  columns,
  actions,
  enableExport,
  enableFilters,
  onReloadDataFn,
  onExportFn,
}: TableCommonProps) => {
  const rerender = useReducer(() => ({}), {})[1];
  const headers = useMemo<ColumnDef<DataTableType>[]>(() => {
    if (columns.length === 0) {
      throw new Error("Columns is empty");
    }
    if (!columns[0]) {
      throw new Error("Columns is empty");
    }
    const firstColumn = columns[0];
    return isGroupColumn(firstColumn)
      ? buildGroupColumnDef(columns as ColumnGroupTableProps[])
      : buildColumnDef(columns as ColumnTableProps[]);
  }, [columns]);
  const ActionButton = ({ title, icon, onClickEvent }: ActionsTableItem) => (
    <Button variant="outlined" startIcon={icon} onClick={() => onClickEvent}>
      {title}
    </Button>
  );

  const table = useReactTable({
    data,
    columns: headers,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onReload = () => {
    console.log("reload data");
    if (onReloadDataFn) {
      try {
        onReloadDataFn();
      } catch (e) {
        console.error("issue with data fetch", e);
      }
    } else {
      rerender();
    }
  };

  const onExport = () => {
    console.log("export data");
    if (onExportFn) {
      try {
        onExportFn();
      } catch (e) {
        console.error("issue with data fetch", e);
      }
    } else {
      const csv = buildCSV(data, columns);
      console.log("csv", csv);
      downloadCsv(csv, `export-${new Date().toISOString()}.csv`);
    }
    return;
  };
  const { pageSize, pageIndex } = table.getState().pagination;
  const rowsPerPageOptions = [25, 50, 100];
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Item>
          <Button
            variant="outlined"
            startIcon={<TfiReload />}
            onClick={() => onReload()}
          >
            {translations.reload}
          </Button>
          {enableExport && (
            <Button
              variant="outlined"
              startIcon={<CgExport />}
              onClick={() => onExport()}
            >
              {translations.export}
            </Button>
          )}
          {(actions?.length ?? 0) > 0 && (
            <ButtonGroup variant="contained" aria-label={translations.actions}>
              {actions?.map((action, index) => (
                <ActionButton key={index} {...action} />
              ))}
            </ButtonGroup>
          )}
        </Item>
        <Item>
          <TableContainer component={Paper}>
            <MuiTable sx={{ minWidth: 400 }} aria-label={title}>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      console.log("header", header);
                      const columnGroupEntity = columns.find(
                        (column) => column.id === header.id,
                      ) as ColumnGroupTableProps;
                      console.log("columnGroupEntity", columnGroupEntity);
                      const columnEntity = columnGroupEntity.columns.find(
                        (column) => column.id === header.id,
                      );
                      console.log("columnEntity", columnEntity);
                      return (
                        <TableCell key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <div>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {columnEntity &&
                              enableFilters &&
                              columnEntity.filterable &&
                              header.column.getCanFilter() ? (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </div>
                              ) : null}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Item>
        <Item>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={pageSize}
            page={pageIndex}
            slotProps={{
              select: {
                inputProps: { "aria-label": translations.rowsPerPage },
                native: true,
              },
            }}
            onPageChange={(_, page) => {
              table.setPageIndex(page);
            }}
            onRowsPerPageChange={(e) => {
              const size = e.target.value ? Number(e.target.value) : 10;
              table.setPageSize(size);
            }}
            ActionsComponent={TablePaginating}
          />
        </Item>
      </Stack>
    </Box>
  );
};
