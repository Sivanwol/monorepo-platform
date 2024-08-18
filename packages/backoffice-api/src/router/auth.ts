import type { TRPCRouterRecord } from "@trpc/server";
import { kv } from "@vercel/kv";
import superjson from "superjson";
import { z } from "zod";

import { invalidateSessionToken } from "@app/auth";
import { repositories } from "@app/db/client";
import { CacheConfig } from "@app/utils";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  // eslint-disable-next-line @typescript-eslint/require-await
  signOut: protectedProcedure.mutation(async (opts) => {
    // if (!opts.ctx.token) {
    //   return { success: false };
    // }
    // await invalidateSessionToken(opts.ctx.token);
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
