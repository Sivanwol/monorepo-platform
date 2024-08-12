import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@app/db";
import { CreateMediaSchema, Media } from "@app/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return ctx.db.query.Media.findMany({
      orderBy: desc(Media.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.post)
      //   .where(eq(schema.post.id, input.id));

      return ctx.db.query.Media.findFirst({
        // where: eq(Media.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateMediaSchema)
    .mutation(({ ctx, input }) => {
       
      return ctx.db.insert(Media).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Media);
  }),
} satisfies TRPCRouterRecord;
