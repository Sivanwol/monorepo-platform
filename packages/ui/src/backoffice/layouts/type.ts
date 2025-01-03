import type { NotificationModel, UserModel } from "@app/db/client";
import type { TranslationRecord } from "@app/utils";

import type { MenuGroup } from "..";

export interface DashboardLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  blockActions: boolean;
  sideMenuItems: MenuGroup[];
  notifications: NotificationModel[];
  user: UserModel;
  lng: string;
  translations: TranslationRecord;
}
