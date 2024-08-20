import type { TRPCRouterRecord } from "@trpc/server";
import { descopeSdk } from "@app/auth"
import { protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    console.log(ctx.session.user);
    console.log(ctx.session.descopeUser);
    return ctx.session.user;
  }),

  signOut: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.session.jwt) {
        await descopeSdk.logout(ctx.session.jwt);
      }
      // await invalidateSessionToken(opts.ctx.token);
    }),
} satisfies TRPCRouterRecord;
