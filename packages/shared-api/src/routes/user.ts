/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { DataTableType } from "@app/utils";
import { protectedProcedure, publicProcedure } from "@app/auth";
import {
  CreateMediaSchema,
  Media,
  UpdateUserProfileSchema,
} from "@app/db/schema";
import { backofficePermmisions, genders, logger } from "@app/utils";

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
      logger.info(`fetching audit for user ${input}`);
      service.verifyBackofficeAccess();
      if (ctx.session.user.id === input) {
        const audits = await service.fetchAuditUser(
          ctx.session.descopeUser?.userId ?? "",
        );
        return {
          entities: audits.map((item) => ({
            ...(item as unknown as DataTableType),
          })),
          total: audits.length,
        };
      }
      if (
        !service.verifyPermissions([
          backofficePermmisions.UserTrack,
        ] as string[])
      ) {
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
        const audits = await service.fetchAuditUser(user.externalId ?? "");
        return {
          entities: audits.map((item) => ({
            ...(item as unknown as DataTableType),
          })),
          total: audits.length,
        };
      }
    }),
  updateMyProfile: protectedProcedure
    .input(UpdateUserProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new UserService(ctx);
      logger.info(`updating user profile... ${JSON.stringify(input)}`);
      await service.UpdateUserProfile(
        ctx.session.user.id,
        ctx.session.user.id,
        {
          firstName: input.firstName!,
          lastName: input.lastName!,
          aboutMe: input.aboutMe!,
          gender: input.gender!,
        },
      );
      return { success: true };
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
      logger.info(`onboarding user... ${JSON.stringify(input)} `);
      const service = new UserService(ctx);
      service.verifyBackofficeAccess();
      return await service.onBoardAdminUser(ctx.session.user.id, input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Media);
  }),
} satisfies TRPCRouterRecord;
