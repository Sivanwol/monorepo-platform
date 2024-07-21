import type { DropdownUserProps, MenuGroup, NotificationItem } from "..";

export interface DefaultLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  sideMenuItems: MenuGroup[];
  notifications: NotificationItem[];
  user: DropdownUserProps;
}
