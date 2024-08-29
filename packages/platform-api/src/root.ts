import { createTRPCRouter } from "@app/auth";
import { authRouter } from "@app/shared-api";

import { postRouter } from "./router/post";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
