import type { NotificationModel, UserModel } from "@app/db/client";
import type { TranslationRecord } from "@app/utils";

export interface DropdownUserProps {
  lng: string;
  translations: TranslationRecord;
  user: UserModel;
}

export interface DropdownNotificationProps {
  lng: string;
  notifications: NotificationModel[];
  translations: TranslationRecord;
}

export interface HeaderProps {
  lng: string;
  notifications: NotificationModel[];
  user: UserModel;
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  blockActions: boolean;
  translations: TranslationRecord;
}
