import type * as schema from "../schema";

export interface NotificationModel {
  id: number;
  userId: number;
  type: schema.notificationType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  affectedEntityId?: number;
  title: string;
  body: string;
  read: boolean;
  createAt: Date;
}
export const convertToNotificationModel = (
  data: typeof schema.Notification.$inferSelect,
): NotificationModel => ({
  id: data.id,
  userId: data.userId,
  type: data.type,
  metadata: data,
  title: data.title,
  body: data.body,
  read: data.read ?? false,
  createAt: new Date(data.createdAt),
});
