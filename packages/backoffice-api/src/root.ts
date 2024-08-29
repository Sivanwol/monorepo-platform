import { createTRPCRouter } from "@app/auth";
import {
  authRouter,
  NotificationRouter,
  settingsRouter,
  userRouter,
} from "@app/shared-api";


export const appRouter = createTRPCRouter({
  auth: authRouter,
  notifications: NotificationRouter,
  settings: settingsRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
