import type { TRPCRouterRecord } from "@trpc/server";

import { invalidateSessionToken } from "@app/auth";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  // eslint-disable-next-line @typescript-eslint/require-await
  signOut: protectedProcedure.mutation(async (opts) => {
    // if (!opts.ctx.session.user) {
    //   return { success: false };
    // }
    // await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
