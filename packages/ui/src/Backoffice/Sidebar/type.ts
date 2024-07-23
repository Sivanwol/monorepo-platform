import type { ComponentProps, FC } from "react";
import type { IconType } from "react-icons";

export interface SidebarProps {
  items: MenuGroup[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
export interface MenuGroup {
  label: string;
  icon: any;
  route?: string;
  items: MenuGroupItem[];
}
export interface MenuGroupItem {
  icon?: IconType;
  label: string;
  route: string;
  children?: MenuGroupItem[];
}
