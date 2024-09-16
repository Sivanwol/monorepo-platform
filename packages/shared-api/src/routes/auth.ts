import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { descopeSdk, protectedProcedure, publicProcedure } from "@app/auth";
import { logger } from "@app/utils";

export const authRouter = {
  getUser: protectedProcedure.query(async ({ ctx }) => {
    logger.info(`requesting user data`, { user: ctx.session.user });
    return ctx.session.user;
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    logger.info(`signing out user`, { user: ctx.session.user });
    if (ctx.session.jwt) {
      await descopeSdk.logout(ctx.session.jwt);
    }
    // await invalidateSessionToken(opts.ctx.token);
  }),
} satisfies TRPCRouterRecord;
