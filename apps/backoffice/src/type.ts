import type { ReactNode } from "react";

export interface LayoutCommonProps {
  children: ReactNode;
  params: {
    lng: string;
  }
}
export type Namespaces = 'home' | 'dashboardLayout';
export type PageCommonProps = Omit<LayoutCommonProps, "children">;

export type DynamicParam = string | number;
export type DynamicString = string | ((options: Record<string, DynamicParam>) => string);

export type DynamicValue =
  | string
  | number
  | DynamicString
  | { [key: string]: DynamicValue };

export type DynamicStructure = Record<string, DynamicValue>;
export type TranslationKeys = 'home' | 'dashboardLayout';
export type Translations = Record<string, Record<string, Record<string, any>>>;
export type InputOptions = Record<string, string | number>;
