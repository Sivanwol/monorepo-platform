"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type {
  Cell,
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
  HeaderGroup,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useReducer, useState } from "react";
// needed for table body level scope DnD setup
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Button, styled, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import { CgExport } from "react-icons/cg";
import { TfiReload } from "react-icons/tfi";

import type { TableStore } from "@app/store-backoffice";
import type {
  ActionsTableItem,
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
  TableCommonProps,
} from "@app/utils";
import { useTableStore } from "@app/store-backoffice";
import {
  ExportTableMode,
  rowsPerPageOptions,
  SortByDirection,
} from "@app/utils";

import { DragAlongCell, DraggableTableHeader } from "./draggableTableContext";
import { Filter } from "./filter";
import { TablePaginating } from "./pageing";
import {
  buildColumnDef,
  buildCSV,
  buildGroupColumnDef,
  convertSortBy,
  downloadCsv,
  getColumnHeader,
  isGroupColumn,
  isObjectEmpty,
  totalHeaderColumns,
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
export const TableBuilder = ({
  tableId,
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
}: TableCommonProps) => {
  if (!tableId) {
    throw new Error("Table Id is required");
  }
  const tableStore = useTableStore<TableStore>((store) => store as TableStore);
  if (!tableStore.tables[tableId]) {
    throw new Error(
      `Table state not found for ${tableId} please run init to populate the table state`,
    );
  }
  const { setPagination, setSort, tables, reload, requestExport } = tableStore;
  const tableState = tables[tableId];
  if (!tableState) {
    throw new Error(
      `Table state not found for ${tableId} please run init on for populate the table state`,
    );
  }
  const { data, pagination, sort, loading, exportMode } = tableState;
  console.log(`${tableId} - tableState`, tableState);
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");
  const rerender = useReducer(() => ({}), {})[1];
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>(direction);
  const [sorting, setSorting] = React.useState<SortingState>(
    sort ? convertSortBy(sort) : [],
  );
  const [processHeader, setProcessHeader] = useState<
    ColumnDef<DataTableType>[]
  >([]);
  const headers = useMemo<ColumnDef<DataTableType>[]>(() => {
    if (columns.length === 0) {
      throw new Error("Columns is empty");
    }
    if (!columns[0]) {
      throw new Error("Columns is empty");
    }
    const firstColumn = columns[0];
    const isGroupColumnRef = isGroupColumn(firstColumn);
    if (rowActions && rowActions.length > 0) {
      const actionColumn: ColumnTableProps = {
        id: "rowActions",
        title: translations.rowActions ?? "Actions",
        type: "internal",
        group: false,
        sort: false,
      };
      if (isGroupColumnRef) {
        const lastGroup = columns[columns.length - 1] as ColumnGroupTableProps;
        if (
          !lastGroup.columns.some((column) => column.id === actionColumn.id)
        ) {
          lastGroup.columns.push(actionColumn);
        }
      } else {
        // add check if this item exist by id
        const existingItem = columns.find(
          (column) => column.id === actionColumn.id,
        );
        if (!existingItem) {
          (columns as ColumnTableProps[]).push(actionColumn);
        }
      }
    }
    if (enableSelection) {
      const selectColumn: ColumnTableProps = {
        id: "select",
        title: "",
        type: "object",
        width: 50,
        sort: false,
        group: false,
      };
      if (isGroupColumnRef) {
        const firstGroup = columns[0] as ColumnGroupTableProps;
        if (
          !firstGroup.columns.some((column) => column.id === selectColumn.id)
        ) {
          firstGroup.columns.unshift(selectColumn);
        }
      } else {
        const existingItem = columns.find(
          (column) => column.id === selectColumn.id,
        );
        if (!existingItem) {
          (columns as ColumnTableProps[]).unshift(selectColumn);
        }
      }
    }
    if (processHeader.length > 0) {
      return processHeader;
    }
    const headers = isGroupColumn(firstColumn)
      ? buildGroupColumnDef(
        columns as ColumnGroupTableProps[],
        translations,
        rowActions,
      )
      : buildColumnDef(columns as ColumnTableProps[], translations, rowActions);
    setProcessHeader(headers);
    return headers;
  }, [
    columns,
    translations,
    rowActions,
    enableSelection,
    processHeader,
    setProcessHeader,
  ]);
  const [columnOrder, setColumnOrder] = React.useState(() =>
    headers.map((c) => c.id).filter((id) => id !== undefined),
  );
  const ActionButton = ({ title, icon, onClickEvent }: ActionsTableItem) => (
    <Button variant="outlined" startIcon={icon} onClick={() => onClickEvent}>
      {title}
    </Button>
  );

  const defaultColumn = {
    maxSize: resize?.maxWidth,
    width: 150,
    minSize: resize?.maxWidth,
  };
  if (debugMode) {
    console.log(`${tableId} - data`, data);
    console.log(`${tableId} - sortBy`, sort);
    console.log(`${tableId} - sorting`, sorting);
    console.log(`${tableId} - pagination`, pagination);
    console.log(`${tableId} - columns`, columns);
    console.log(`${tableId} - headers`, headers);
    console.log(`${tableId} - rowSelection`, rowSelection);
    console.log(`${tableId} - columnOrder`, columnOrder);
    console.log(`${tableId} - direction`, direction);
    console.log(`${tableId} - resize`, resize);
    console.log(`${tableId} - enableSelection`, enableSelection);
    console.log(`${tableId} - enableSorting`, enableSorting);
    console.log(`${tableId} - enableFilters`, enableFilters);
    console.log(`${tableId} - enableExport`, enableExport);
    console.log(`${tableId} - rowActions`, rowActions);
  }
  const table = useReactTable({
    data,
    columns: headers,
    defaultColumn: resize ? defaultColumn : undefined,
    columnResizeMode: resize ? columnResizeMode : undefined,
    enableRowSelection: enableSelection ?? false,
    state: {
      rowSelection,
      columnOrder,
      sorting,
    },
    // initialState: {
    //   pagination: { pageIndex: pagination.page, pageSize: pagination.pageSize },
    // },
    enableMultiSort: false,
    enableColumnResizing: true,
    // manualPagination: true,
    // rowCount: pagination.totalEntries,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    columnResizeDirection,
    enableSorting: enableSorting ?? false,
    manualSorting: true,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugAll: debugMode ?? false,
  });

  const onReload = () => {
    console.log(`${tableId} - reload data`);
    reload(tableId).catch(console.error);
  };

  // reorder columns after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );
  const onExport = () => {
    console.log(`${tableId} - export data`);
    if (exportMode === ExportTableMode.ServerSide) {
      requestExport(tableId).catch(console.error);
      return;
    } else {
      let dataToExport = data; // in case of no selection local export will be to all existing data
      if (
        !isObjectEmpty(rowSelection) ||
        data.length !== Object.keys(rowSelection).length
      ) {
        dataToExport = data.filter((row: DataTableType, index: number) => {
          return rowSelection[index] === true;
        });
      }
      const csv = buildCSV(dataToExport, columns);
      downloadCsv(csv, `export-${new Date().toISOString()}.csv`);
    }
    return;
  };
  const renderSelectionHeader = (headerGroup: HeaderGroup<DataTableType>) => {
    const columnEntity = getColumnHeader("select", columns);
    const header = headerGroup.headers.find((header) => header.id === "select");
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!columnEntity || !header) return null;
    return (
      <TableCell
        key={header.id}
        colSpan={header.colSpan}
        style={{
          width: columnEntity.width ?? header.getSize(),
        }}
      >
        <DraggableTableHeader header={header}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </DraggableTableHeader>
      </TableCell>
    );
  };
  const renderSelectionCell = (cells: Cell<DataTableType, unknown>[]) => {
    const cell = cells.find((cell) => cell.column.columnDef.id === "select");
    if (!enableSelection || !cell) return null;
    return (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  };
  let totalTableHeaders = 0;
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h2" component="div" gutterBottom>
          {translations.title}
        </Typography>
      </Box>
      <Stack spacing={2} divider={null}>
        <Item>
          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Item className="w-full">
              <div
                className="flex w-full flex-row-reverse gap-4"
                style={{ alignItems: direction === "rtl" ? "left" : "right" }}
              >
                <div
                  className={classNames("w-fit", "flex", "flex-row", {
                    "ml-4": direction === "rtl",
                    "mr-4": direction !== "rtl",
                  })}
                >
                  <div
                    className={classNames({
                      "ml-4": direction === "rtl",
                      "mr-4": direction !== "rtl",
                    })}
                  >
                    {enableExport && (
                      <Button
                        variant="outlined"
                        startIcon={<CgExport />}
                        onClick={() => onExport()}
                      >
                        {translations.export}
                      </Button>
                    )}
                  </div>
                  <div
                    className={classNames({
                      "ml-4": direction === "rtl",
                      "mr-4": direction !== "rtl",
                    })}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<TfiReload />}
                      onClick={() => onReload()}
                    >
                      {translations.reload}
                    </Button>
                  </div>
                </div>
                <div className={classNames("w-36")}>&nbsp;</div>
                <div
                  className={classNames({
                    "ml-4": direction === "rtl",
                    "mr-4": direction !== "rtl",
                  })}
                >
                  {(actions?.length ?? 0) > 0 && (
                    <ButtonGroup
                      variant="contained"
                      aria-label={translations.actions}
                    >
                      {actions?.map((action, index) => (
                        <ActionButton key={index} {...action} />
                      ))}
                    </ButtonGroup>
                  )}
                </div>
              </div>
            </Item>
          </Stack>
        </Item>
        <Item>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <TableContainer component={Paper}>
              <MuiTable
                stickyHeader
                sx={{ width: "100%", minWidth: 400 }}
                aria-label={translations.title}
              >
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        {enableSelection &&
                          table.getRowModel().rows.length > 0 &&
                          renderSelectionHeader(headerGroup)}
                        {headerGroup.headers.map((header) => {
                          totalTableHeaders++;
                          const columnEntity = getColumnHeader(
                            header.id,
                            columns,
                          );
                          if (columnEntity.id === "select") {
                            return null;
                          }
                          return (
                            <TableCell
                              key={header.id}
                              colSpan={header.colSpan}
                              style={{
                                width: columnEntity.width ?? header.getSize(),
                              }}
                            >
                              <DraggableTableHeader header={header}>
                                {!columnEntity.sort ? (
                                  <>
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                                    {columnEntity &&
                                      enableFilters &&
                                      "filterable" in columnEntity &&
                                      columnEntity.filterable &&
                                      header.column.getCanFilter() ? (
                                      <div>
                                        <Filter
                                          column={header.column}
                                          table={table}
                                        />
                                      </div>
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    {header.isPlaceholder ? null : (
                                      <TableSortLabel
                                        active={
                                          header.column.getCanSort() &&
                                          !!header.column.getIsSorted()
                                        }
                                        direction={
                                          header.column.getIsSorted()
                                            ? header.column.getNextSortingOrder() ===
                                              "desc"
                                              ? "asc"
                                              : "desc"
                                            : undefined
                                        }
                                        onClick={async () => {
                                          if (
                                            !header.column.getNextSortingOrder()
                                          ) {
                                            await setSort(tableId, null);
                                            setSorting([]);
                                            return;
                                          }
                                          await setSort(tableId, {
                                            columnId: header.column.id,
                                            direction:
                                              header.column.getNextSortingOrder() ===
                                                "desc"
                                                ? SortByDirection.DESC
                                                : SortByDirection.ASC,
                                          });
                                          setSorting([
                                            {
                                              id: header.column.id,
                                              desc:
                                                header.column.getNextSortingOrder() ===
                                                "desc",
                                            },
                                          ]);
                                        }}
                                      >
                                        {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                        )}
                                        {columnEntity &&
                                          enableFilters &&
                                          "filterable" in columnEntity &&
                                          columnEntity.filterable &&
                                          header.column.getCanFilter() ? (
                                          <div>
                                            <Filter
                                              column={header.column}
                                              table={table}
                                            />
                                          </div>
                                        ) : null}
                                        {!!header.column.getIsSorted() &&
                                          header.column.getCanSort() &&
                                          columnEntity.sort ? (
                                          <Box
                                            component="span"
                                            sx={visuallyHidden}
                                          >
                                            {header.column.getIsSorted() ===
                                              "desc"
                                              ? "sorted descending"
                                              : "sorted ascending"}
                                          </Box>
                                        ) : null}
                                      </TableSortLabel>
                                    )}
                                  </>
                                )}
                              </DraggableTableHeader>
                            </TableCell>
                          );
                        })}
                      </SortableContext>
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={totalTableHeaders}>
                        <Typography
                          variant="h3"
                          component="div"
                          gutterBottom
                          sx={{
                            color: "text.secondary",
                            fontSize: 14,
                            textAlign: "center",
                          }}
                        >
                          <h2>{translations.loading}</h2>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && table.getRowModel().rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={totalTableHeaders}>
                        <Typography
                          variant="h3"
                          component="div"
                          gutterBottom
                          sx={{
                            color: "text.secondary",
                            fontSize: 14,
                            textAlign: "center",
                          }}
                        >
                          {translations.noData}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    table.getRowModel().rows.length > 0 &&
                    table.getRowModel().rows.map((row) => {
                      return (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          {enableSelection &&
                            renderSelectionCell(row.getVisibleCells())}
                          {row.getVisibleCells().map((cell) => {
                            if (cell.column.columnDef.id === "select") {
                              return null;
                            }
                            return (
                              <TableCell key={cell.id}>
                                <SortableContext
                                  key={cell.id}
                                  items={columnOrder}
                                  strategy={horizontalListSortingStrategy}
                                >
                                  <DragAlongCell key={cell.id} cell={cell}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </DragAlongCell>
                                </SortableContext>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </MuiTable>
            </TableContainer>
          </DndContext>
        </Item>
        <Item>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={pagination.totalEntries}
            rowsPerPage={pagination.pageSize}
            page={pagination.page}
            onPageChange={async (_, page) => {
              table.setPageIndex(pagination.page);
              await setPagination(tableId, {
                page,
                pageSize: pagination.pageSize,
                totalEntries: pagination.totalEntries,
              });
            }}
            onRowsPerPageChange={async (e) => {
              const size = e.target.value ? Number(e.target.value) : 20;
              table.setPageSize(size);
              await setPagination(tableId, {
                page: 1,
                pageSize: pagination.pageSize,
                totalEntries: pagination.totalEntries,
              });
            }}
            ActionsComponent={TablePaginating}
          />
        </Item>
      </Stack>
    </Box>
  );
};
