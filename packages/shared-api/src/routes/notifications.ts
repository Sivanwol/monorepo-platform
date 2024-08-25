import { get } from "@vercel/edge-config";

import { EventEmitter } from 'events';
import { env } from "@app/auth/env";
import { EdgeConfig } from "@app/utils";
import { asc, desc, eq } from 'drizzle-orm';

import { protectedProcedure } from "../trpc";
import { Notification } from '@app/db/schema';
import { observable } from "@trpc/server/observable";
export const NotificationEvent = new EventEmitter();
export type NotificationEventModel = {
  userId?: number;
  action: "reload";
}
export const NotificationRouter = {
  getLastNotification: protectedProcedure.query(async ({ ctx }) => {
    console.log("getting last notification");
    try {
      const res = await ctx.db
        .select()
        .from(Notification)
        .where(eq(Notification.userId, ctx.session.user?.id!))
        .orderBy(desc(Notification.createdAt), asc(Notification.read)).limit(10);
      return { notification: res };
    } catch (error) {
      console.error("Error getting last notification:", error);
      return { notification: null };
    }
  }),
};
