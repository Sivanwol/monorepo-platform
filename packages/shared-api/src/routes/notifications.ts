
import { EventEmitter } from 'events';

import { protectedProcedure } from "../trpc";
export const NotificationEvent = new EventEmitter();
export interface NotificationEventModel {
  userId?: number;
  action: "reload";
}
export const NotificationRouter = {
  getLastNotification: protectedProcedure.query(async ({ ctx }) => {
    console.log("getting last notification");
    try {

      const res = await ctx.repositories.notification.GetLastNotification(ctx.session.user!.id);
      return { items: res };
    } catch (error) {

      console.error("Error getting last notification:", error);
      return { items: [] };
    }
  }),
};
