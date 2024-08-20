import { translationRecord } from "../layouts/type";

export interface DropdownUserProps {
  userAvatar: string;
  fullname: string;
  email: string;
  profileLink: string;
  settingsLink: string;
  translations: translationRecord
}

export interface DropdownNotificationProps {
  notifications: NotificationItem[];
  translations: translationRecord
}
export interface NotificationItem {
  icon: React.ReactNode;
  image: string;
  title: string;
  subTitle: string;
  translations: translationRecord
}
export interface HeaderProps {
  notifications: NotificationItem[];
  user: DropdownUserProps;
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  blockActions: boolean;
  translations: translationRecord
}
