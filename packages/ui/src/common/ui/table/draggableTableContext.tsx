// needed for table body level scope DnD setup
import type { Cell, Header } from "@tanstack/react-table";
import type { CSSProperties } from "react";
// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import { RiDraggable } from "react-icons/ri";

import type { DataTableType } from "@app/utils";

import { filterColumn } from "./utils";

export const DraggableTableHeader = ({
  children,
  header,
  softElm,
  frozen,
}: {
  children: React.ReactNode;
  header: Header<DataTableType, unknown>;
  softElm?: React.ReactNode;
  frozen?: boolean;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    zIndex: isDragging ? 1 : 0,
  };
  const hideHandle = !filterColumn(header.column.id) || frozen; // columns cases that we not want allow DnD support
  return (
    <div style={style} ref={setNodeRef}>
      {children}
      <div
        className={classNames("inline", "w-14", "align-sub", {
          hidden: hideHandle,
        })}
      >
        <button {...attributes} {...listeners}>
          <RiDraggable />
        </button>
        {softElm && (
          <div className={classNames("inline", "w-14", "align-sub")}>
            {softElm}
          </div>
        )}
      </div>
    </div>
  );
};

export const DragAlongCell = ({
  children,
  cell,
}: {
  children: React.ReactNode;
  cell: Cell<DataTableType, unknown>;
}) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div style={style} ref={setNodeRef}>
      {children}
    </div>
  );
};
