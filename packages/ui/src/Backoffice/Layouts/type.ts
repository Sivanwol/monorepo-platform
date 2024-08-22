import type { DropdownUserProps, MenuGroup, NotificationItem } from "..";

export interface DashboardLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  blockActions: boolean;
  sideMenuItems: MenuGroup[];
  notifications: NotificationItem[];
  user: DropdownUserProps;
  lng: string;
  translations: translationRecord
}
export type translationRecord = {
  [key: string]: string;
}
