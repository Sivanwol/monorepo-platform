import { DropdownUserProps, MenuGroup, NotificationItem } from "..";

export type DefaultLayoutProps = {
  children: any;
  sideMenuItems: MenuGroup[];
  notifications: NotificationItem[];
  user: DropdownUserProps
}
