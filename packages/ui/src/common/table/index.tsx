"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import type {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingFn,
  SortingState,
  Updater,
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
import { Button, styled } from "@mui/material";
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

import type {
  ActionsTableItem,
  ColumnGroupTableProps,
  ColumnTableProps,
  DataTableType,
  TableCommonProps,
} from "@app/utils";

import { SortByDirection } from "../context";
import { useSort } from "../hooks";
import { DragAlongCell, DraggableTableHeader } from "./draggableTableContext";
import { Filter } from "./filter";
import { TablePaginating } from "./pageing";
import {
  buildColumnDef,
  buildCSV,
  buildGroupColumnDef,
  convertSortBy,
  downloadCsv,
  filterColumn,
  getHeaderFromColumn,
  isGroupColumn,
  isObjectEmpty,
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
  enableSelection,
  enableSorting,
  onReloadDataFn,
  onExportFn,
  resize,
  direction,
  rowActions,
  debugMode,
}: TableCommonProps) => {
  const [columnResizeMode, setColumnResizeMode] =
    useState<ColumnResizeMode>("onChange");
  const { sortBy, UpdateSortBy, ResetSortBy } = useSort();
  const [sorting, setSorting] = React.useState<SortingState>(
    convertSortBy(sortBy),
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>(direction);
  const rerender = useReducer(() => ({}), {})[1];

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
      };
      if (isGroupColumnRef) {
        const lastGroup = columns[columns.length - 1] as ColumnGroupTableProps;
        lastGroup.columns.push(actionColumn);
      } else {
        (columns as ColumnTableProps[]).push(actionColumn);
      }
    }
    if (enableSelection) {
      const selectColumn: ColumnTableProps = {
        id: "select",
        title: "",
        type: "object",
        group: false,
      };
      if (isGroupColumnRef) {
        const firstGroup = columns[0] as ColumnGroupTableProps;
        firstGroup.columns.unshift(selectColumn);
        columns[0] = firstGroup;
      } else {
        (columns as ColumnTableProps[]).unshift(selectColumn);
      }
    }
    return isGroupColumn(firstColumn)
      ? buildGroupColumnDef(
          columns as ColumnGroupTableProps[],
          translations,
          rowActions,
        )
      : buildColumnDef(columns as ColumnTableProps[], translations, rowActions);
  }, [columns, rowActions, enableSelection, translations]);
  useEffect(() => {
    const currentSorting = sorting[0];
    if (currentSorting) {
      const requireResetSorting = !currentSorting;
      const currentDirection = requireResetSorting
        ? null
        : !currentSorting.desc
          ? SortByDirection.ASC
          : SortByDirection.DESC;
      if (
        (sortBy &&
          (sortBy.columnId !== currentSorting.id ||
            sortBy.direction !== currentDirection)) ||
        !sortBy
      ) {
        const column = getHeaderFromColumn(currentSorting.id, columns);
        if (column) {
          if (requireResetSorting || !currentDirection) {
            ResetSortBy(column.id);
          } else {
            UpdateSortBy({
              columnId: column.id,
              direction: currentDirection,
            });
          }
          rerender();
        }
      }
    }
  }, [sorting, sortBy, columns, ResetSortBy, UpdateSortBy]);
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
    minSize: resize?.maxWidth,
  };

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
    initialState: { pagination: { pageIndex: 0, pageSize: 50 } },
    enableMultiSort: false,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    columnResizeDirection,
    enableSorting: enableSorting ?? false,
    manualSorting: enableSorting ?? false,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugAll: debugMode ?? false,
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
    console.log("export data");
    if (onExportFn) {
      try {
        onExportFn();
      } catch (e) {
        console.error("issue with data fetch", e);
      }
    } else {
      let dataToExport = data; // in case of no selection local export will be to all existing data
      if (
        !isObjectEmpty(rowSelection) ||
        data.length !== Object.keys(rowSelection).length
      ) {
        dataToExport = data.filter((row, index) => {
          return rowSelection[index] === true;
        });
      }
      const csv = buildCSV(dataToExport, columns);
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
          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Item>
              <Button
                variant="outlined"
                startIcon={<TfiReload />}
                onClick={() => onReload()}
              >
                {translations.reload}
              </Button>
            </Item>
            {enableExport && (
              <Item>
                <Button
                  variant="outlined"
                  startIcon={<CgExport />}
                  onClick={() => onExport()}
                >
                  {translations.export}
                </Button>
              </Item>
            )}
            {(actions?.length ?? 0) > 0 && (
              <Item>
                <ButtonGroup
                  variant="contained"
                  aria-label={translations.actions}
                >
                  {actions?.map((action, index) => (
                    <ActionButton key={index} {...action} />
                  ))}
                </ButtonGroup>
              </Item>
            )}
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
                sx={{ width: table.getCenterTotalSize(), minWidth: 400 }}
                aria-label={title}
              >
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        {headerGroup.headers.map((header) => {
                          const columnGroupEntity = columns.find(
                            (column) => column.id === header.id,
                          ) as ColumnGroupTableProps;
                          const columnEntity =
                            columnGroupEntity.columns !== undefined
                              ? columnGroupEntity.columns.find(
                                  (column) => column.id === header.id,
                                )
                              : columnGroupEntity;
                          return (
                            <TableCell
                              key={header.id}
                              colSpan={header.colSpan}
                              style={{
                                width: header.getSize() + 20, // we add 20 px for the DnD handle
                              }}
                            >
                              <DraggableTableHeader header={header}>
                                {header.isPlaceholder ? null : (
                                  <>
                                    <div
                                      className={classNames("inline", {
                                        "cursor-pointer select-none":
                                          header.column.getCanSort(),
                                      })}
                                      onClick={header.column.getToggleSortingHandler()}
                                      title={
                                        header.column.getCanSort()
                                          ? header.column.getNextSortingOrder() ===
                                            "asc"
                                            ? "Sort ascending"
                                            : header.column.getNextSortingOrder() ===
                                                "desc"
                                              ? "Sort descending"
                                              : "Clear sort"
                                          : undefined
                                      }
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

                                      {{
                                        asc: " 🔼",
                                        desc: " 🔽",
                                      }[
                                        header.column.getIsSorted() as string
                                      ] ?? null}
                                    </div>
                                    {/* <div
                                      {...{
                                        onDoubleClick: () =>
                                          header.column.resetSize(),
                                        onMouseDown:
                                          header.getResizeHandler(),
                                        onTouchStart:
                                          header.getResizeHandler(),
                                        className: `resizer ${table.options.columnResizeDirection
                                          } ${header.column.getIsResizing()
                                            ? "isResizing"
                                            : ""
                                          }`,
                                        style: {
                                          transform:
                                            columnResizeMode === "onEnd" &&
                                              header.column.getIsResizing()
                                              ? `translateX(${(table.options
                                                .columnResizeDirection ===
                                                "rtl"
                                                ? -1
                                                : 1) *
                                              (table.getState()
                                                .columnSizingInfo
                                                .deltaOffset ?? 0)
                                              }px)`
                                              : "",
                                        },
                                      }}
                                    /> */}
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
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
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
