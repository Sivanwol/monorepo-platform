import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { CreateMediaSchema, Media, OnBoardAdminUserSchema } from "@app/db/schema";
import { createSdk } from "@descope/nextjs-sdk/server";
import type { AuthenticationInfo } from "@descope/node-sdk";
import { protectedProcedure, publicProcedure } from "@app/auth";
import { genders } from "@app/utils";

const descopeSdk = createSdk({
  projectId: process.env.NEXT_PUBLIC_AUTH_DESCOPE_ID || "",
  managementKey: process.env.AUTH_DESCOPE_MGT_KEY || "",
});
export const userRouter = {

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

  boardingAdminUser: protectedProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      gender: z.enum(genders),
      aboutMe: z.string().optional(),
      avatar: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log(`onboarding user... ${JSON.stringify(input)} `);
      const validPerm = descopeSdk.validatePermissions(ctx.session.token as unknown as AuthenticationInfo, ["backoffice"]);
      if (!validPerm) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }
      if (await ctx.repositories.user.HasUserNeedOnBoarding(ctx.session.descopeUser?.userId!)) {
        await ctx.repositories.user.BoardingAdminUser(ctx.session.user.id, {
          firstName: input.firstName,
          lastName: input.lastName,
          gender: input.gender,
          aboutMe: input.aboutMe,
          avatar: input.avatar,
          phone: input.phone,
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not need onboarding",
        });
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Media);
  }),
} satisfies TRPCRouterRecord;
