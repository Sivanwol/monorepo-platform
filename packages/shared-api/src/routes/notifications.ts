import { EventEmitter } from "events";

import { protectedProcedure, publicProcedure } from "@app/auth";
import { logger } from "@app/utils";

export const NotificationEvent = new EventEmitter();
export interface NotificationEventModel {
  userId?: number;
  action: "reload";
}
export const NotificationRouter = {
  getLastNotification: protectedProcedure.query(async ({ ctx }) => {
    logger.info("getting last notification");
    try {
      const res = await ctx.repositories.notification.GetLastNotification(
        ctx.session.user.id,
      );
      return { items: res };
    } catch (error) {
      logger.error("Error getting last notification:", { error });
      return { items: [] };
    }
  }),
};
