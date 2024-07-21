export interface DropdownUserProps {
  userAvatar: string;
  username: string;
  fullname: string;
  userId: string | number;
  onLogoutClick: () => void;
  profileLink: string;
  settingsLink: string;
}

export interface DropdownNotificationProps {
  notifications: NotificationItem[];
}
export type NotificationItem = {
  icon: React.ReactNode;
  image: string;
  title: string;
  subTitle: string;
}
export type HeaderProps = {
  notifications: NotificationItem[];
  user: DropdownUserProps
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}
