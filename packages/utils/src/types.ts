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

interface sortAbleHeader {
  enable: boolean;
  key: string;
  desc: "asc" | "desc";
  sortingFn?: string;
}

export interface ColumnTableProps {
  id: string;
  title: string;
  type: "string" | "number" | "date" | "boolean" | "object";
  fixed?: "left" | "right";
  group: false;
  width?: number;
  visible?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  sort?: sortAbleHeader; // null will set sortable to false
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
  icon: React.ReactNode;
  onClickEvent: () => void;
}

export interface UserTestPageProps extends CommonLanguageProps {
  columns: ColumnTableProps[] | ColumnGroupTableProps[];
}
export interface TableCommonProps {
  title: string;
  translations: TranslationRecord;
  columns: ColumnTableProps[] | ColumnGroupTableProps[];
  actions?: ActionsTableItem[];
  data: DataTableType[];
  multiSort?: boolean;
  enableResize?: boolean;
  resize?: {
    minWidth: number;
    maxWidth: number;
  };
  enableInfinityScroll?: boolean;
  editMode?: "inline" | "modal";
  editModalComponent?: React.ReactNode;
  onReloadDataFn?: () => void;
  onInfinityScrollUpdateFn?: () => void;
  enableSelection?: boolean;
  enableExport?: boolean;
  enableFilters?: boolean;
  enableSearch?: boolean;
  searchComponent?: React.ReactNode;
}
