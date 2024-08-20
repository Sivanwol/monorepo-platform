import type { ComponentProps, FC } from "react";
import type { IconType } from "react-icons";
import { translationRecord } from "../layouts/type";

export interface SidebarProps {
  items: MenuGroup[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  translations: translationRecord
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
