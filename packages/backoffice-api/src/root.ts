import {
  authRouter,
  NotificationRouter,
  settingsRouter,
} from "@app/shared-api";

import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  notifications: NotificationRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
