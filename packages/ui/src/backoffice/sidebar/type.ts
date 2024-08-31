import type { TranslationRecord } from "@app/utils";

export interface SidebarProps {
  lng: string;
  items: MenuGroup[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  translations: TranslationRecord;
}
export interface MenuGroup {
  label: string;
  icon: string;
  route?: string;
  items: MenuGroupItem[];
}
export interface MenuGroupItem {
  icon: string | null;
  label: string;
  route: string;
  children?: MenuGroupItem[];
}
