import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { asc, desc, eq } from "drizzle-orm";

import { logger } from "@app/utils";

import type { NotificationModel } from "../Models";
import { convertToNotificationModel } from "../Models";
import * as schema from "../schema";

export class NotificationRepository {
  constructor(public db: VercelPgDatabase<typeof schema>) {}

  public async GetLastNotification(
    userId: number,
  ): Promise<NotificationModel[]> {
    logger.info(`fetch get last notification for user id ${userId}`);
    const res = await this.db
      .select()
      .from(schema.Notification)
      .where(eq(schema.Notification.userId, userId))
      .orderBy(
        desc(schema.Notification.createdAt),
        asc(schema.Notification.read),
      )
      .limit(10);

    return res.map(convertToNotificationModel);
  }
}
