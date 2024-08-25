import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";
import { authRouter } from "@app/shared-api";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
