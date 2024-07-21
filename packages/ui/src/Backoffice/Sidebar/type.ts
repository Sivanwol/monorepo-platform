
export interface SidebarProps {
  items: MenuGroup[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
export interface MenuGroup {
  name: string;
  items: MenuGroupItem[];
}
export interface MenuGroupItem {
  icon?: React.ReactNode,
  label: string;
  route: string;
  children?: MenuGroupItem[];
}
