import type { Namespaces, TranslationRecord } from "./translations";

export const genders = ["male", "female", "other"] as const;
export type Gender = "male" | "female" | "other";

/** User base details from Descope API */
export interface User {
  email?: string;
  name?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  phone?: string;
}
/** User extended details from Descope API */
export type UserResponse = User & {
  loginIds: string[];
  userId: string;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  picture?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customAttributes?: Record<string, any>;
  status: string;
};

export interface UserAuditInfo {
  device: string;
  geo: string;
  remoteAddress: string;
  browser: string;
  os: string;
  osVersion: string;
  providerName: string;
  occurred: Date;
}

export interface CommonLanguageProps {
  lng: string;
  ns: Namespaces;
}

export interface BreadcrumbProps {
  homepageTitle: string;
}

export interface ColumnTableProps {
  id: string;
  title: string;
  type: "string" | "number" | "date" | "boolean" | "object" | "internal";
  fixed?: "left" | "right";
  group: false;
  width?: number;
  visible?: boolean;
  filterable?: boolean;
  freeze?: boolean;
  sort?: boolean; // null will set sortable to false
}

export type DataTableType = Record<
  string,
  string | boolean | Date | number | object
>;

export interface ColumnGroupTableProps {
  id: string;
  title: string;
  columns: ColumnTableProps[];
  group: true;
}
export interface ActionsTableItem {
  title: string;
  useRowSelection?: boolean;
  icon: React.ReactNode;
  onClickEvent: () => void;
}

export interface RowActionsTableItem {
  title: string;
  icon: React.ReactNode;
  onClickEvent: (row: DataTableType) => void;
}

export interface UserTestPageProps extends CommonLanguageProps {
  translations: TranslationRecord;
  columns: ColumnTableProps[] | ColumnGroupTableProps[];
}

export interface UserPageProps extends CommonLanguageProps {
  userId: number;
  // tableId: string;
  translations: TranslationRecord;
  columns: ColumnTableProps[] | ColumnGroupTableProps[];
}

interface CommonTableProps {
  direction: "ltr" | "rtl";
  translations: TranslationRecord;
  columns: ColumnTableProps[] | ColumnGroupTableProps[];
  actions?: ActionsTableItem[];
  resize?: {
    minWidth: number;
    maxWidth: number;
  };
  enableInfinityScroll?: boolean;
  editMode?: "inline" | "modal";
  editModalComponent?: React.ReactNode;
  onFilterFn?: (filedId: string, filter: string) => void;
  rowActions?: RowActionsTableItem[];
  enableSorting?: boolean;
  enableSelection?: boolean;
  enableExport?: boolean;
  enableFilters?: boolean;
  enableSearch?: boolean;
  searchComponent?: React.ReactNode;
  debugMode?: boolean;
}
export interface TableWarpProps extends CommonTableProps {
  tableId: string;
  children?: React.ReactNode;
}
export interface TableCommonProps extends CommonTableProps {
  tableId: string;
}

export enum SortByDirection {
  ASC = "asc",
  DESC = "desc",
}
export interface Pagination {
  page: number;
  pageSize: number;
  totalEntries: number;
}
export interface SortByOpt {
  columnId: string;
  direction: SortByDirection;
}

export enum ExportTableMode {
  ClientSide,
  ServerSide,
}
