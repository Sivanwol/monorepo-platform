import type { NotificationModel, UserModel } from "@app/db/client";

import type { translationRecord } from "../layouts/type";

export interface DropdownUserProps {
  lng: string;
  translations: translationRecord;
  user: UserModel;
}

export interface DropdownNotificationProps {
  lng: string;
  notifications: NotificationModel[];
  translations: translationRecord;
}

export interface HeaderProps {
  lng: string;
  notifications: NotificationModel[];
  user: UserModel;
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  blockActions: boolean;
  translations: translationRecord;
}
