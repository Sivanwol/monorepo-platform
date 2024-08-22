import { translationRecord } from "../layouts/type";

export interface DropdownUserProps {
  lng: string;
  userAvatar: string;
  fullname: string;
  email: string;
  profileLink: string;
  settingsLink: string;
  translations: translationRecord
}

export interface DropdownNotificationProps {
  lng: string;
  notifications: NotificationItem[];
  translations: translationRecord
}
export interface NotificationItem {
  icon: React.ReactNode;
  image: string;
  lng: string;
  title: string;
  subTitle: string;
  translations: translationRecord
}
export interface HeaderProps {
  lng: string;
  notifications: NotificationItem[];
  user: DropdownUserProps;
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  blockActions: boolean;
  translations: translationRecord
}
