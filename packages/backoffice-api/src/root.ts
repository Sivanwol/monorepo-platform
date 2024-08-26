
import { createTRPCRouter } from "./trpc";
import { authRouter, settingsRouter, NotificationRouter } from "@app/shared-api";
export const appRouter = createTRPCRouter({
  auth: authRouter,
  notifications: NotificationRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
