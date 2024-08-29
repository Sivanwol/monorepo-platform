import type { ReactNode } from "react";

export interface BaseCommonProps {
  children: ReactNode;
}
export type LayoutCommonProps = BaseCommonProps & {
  params: {
    lng: string;
  };
};
export type Namespaces = "home" | "dashboardLayout" | "support" | "userHistory";
export type TranslationKeys = Namespaces;
export type PageCommonProps = Omit<LayoutCommonProps, "children">;
export type BasePageCommonProps = Omit<BaseCommonProps, "children">;

export type DynamicParam = string | number;
export type DynamicString =
  | string
  | ((options: Record<string, DynamicParam>) => string);

export type DynamicValue =
  | string
  | number
  | DynamicString
  | { [key: string]: DynamicValue };

export type DynamicStructure = Record<string, DynamicValue>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Translations = Record<string, Record<string, Record<string, any>>>;
export type InputOptions = Record<string, string | number>;
