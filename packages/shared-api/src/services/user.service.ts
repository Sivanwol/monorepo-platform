import { TRPCError } from "@trpc/server";

import { descopeSdk } from "@app/auth";

import type { InputOnboardingAdminUserPayload } from "./types";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
  public async fetchAuditUser(userId: string) {
    const searchOptions = {
      userIds: [userId],
      actions: ["LoginSucceed"],
    };
    const aduitRes = await descopeSdk.management.audit.search(searchOptions);
    if (!aduitRes.ok) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No aduit found for user",
      });
    }
    return aduitRes.data ?? [];
  }
  public async onBoardAdminUser(
    userId: number,
    payload: InputOnboardingAdminUserPayload,
  ) {
    if (
      await this.ctx.repositories.user.HasUserNeedOnBoarding(
        this.ctx.session.descopeUser?.userId ?? "",
      )
    ) {
      await this.ctx.repositories.user.BoardingAdminUser(
        this.ctx.session.user.id,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          gender: payload.gender, // Cast payload.gender to Gender type
          aboutMe: payload.aboutMe,
          avatar: payload.avatar,
          phone: payload.phone,
        },
      );
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not need onboarding",
      });
    }
    return { success: true };
  }
}
