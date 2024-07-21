
export interface SidebarProps {
  items: MenuGroup[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
export type MenuGroup = {
  name: string;
  items: MenuGroupItem[];
}
export type MenuGroupItem = {
  icon?: React.ReactNode,
  label: string;
  route: string;
  children?: MenuGroupItem[];
}
