import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { descopeSdk, protectedProcedure, publicProcedure } from "@app/auth";

export const authRouter = {
  getUser: protectedProcedure.query(({ ctx }) => {
    console.log(`requesting user data`, ctx.session.user);
    return ctx.session.user;
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    console.log(`signing out user`, ctx.session.user);
    if (ctx.session.jwt) {
      await descopeSdk.logout(ctx.session.jwt);
    }
    // await invalidateSessionToken(opts.ctx.token);
  }),
} satisfies TRPCRouterRecord;
