import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "@app/auth";
import {
  CreateMediaSchema,
  Media,
  OnBoardAdminUserSchema,
} from "@app/db/schema";
import { backofficePermmisions, genders } from "@app/utils";

import { UserService } from "../services";

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

  securityAudit: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const service = new UserService(ctx);
      service.verifyBackofficeAccess();
      if (ctx.session.user.id === input) {
        return await service.fetchAuditUser(
          ctx.session.descopeUser?.userId ?? "",
        );
      } else {
        if (!service.verifyPermissions([backofficePermmisions.UserTrack] as string[])) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to perform this action",
          });
        }
        if (await ctx.repositories.user.HasUserExist(input)) {
          const user = await ctx.repositories.user.GetUserById(input);
          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `User ID ${input} not found`,
            });
          }
          return await service.fetchAuditUser(user.externalId ?? "");
        }
      }
    }),
  boardingAdminUser: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        gender: z.enum(genders),
        aboutMe: z.string().optional(),
        avatar: z.string().optional(),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`onboarding user... ${JSON.stringify(input)} `);
      const service = new UserService(ctx);
      service.verifyBackofficeAccess();
      return await service.onBoardAdminUser(ctx.session.user.id, input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Media);
  }),
} satisfies TRPCRouterRecord;
