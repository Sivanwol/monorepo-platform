import { TRPCError } from "@trpc/server";
import { fromUnixTime, toDate } from "date-fns";

import type { UserAuditInfo } from "@app/utils";
import { descopeSdk } from "@app/auth";

import type { InputOnboardingAdminUserPayload } from "./types";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
  public async fetchAuditUser(userId: string): Promise<UserAuditInfo[]> {
    const searchOptions = {
      userIds: [userId],
      tenants: ["T2lLM64ZZh1o1nAjWuWmSw1iA1Mu"],
      from: Date.now() - 10 * 24 * 60 * 60 * 1000,
      actions: ["LoginSucceed"],
    };
    console.log(`service search options ${JSON.stringify(searchOptions)}`);
    const auditRes = await descopeSdk.management.audit.search(searchOptions);
    if (!auditRes.ok) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No aduit found for user",
      });
    }
    return (
      auditRes.data?.map((item) => ({
        device: item.device,
        geo: item.geo,
        remoteAddress: item.remoteAddress,
        browser: item.data.browser as string,
        os: item.data.os as string,
        osVersion: item.data.osVersion as string,
        providerName: item.data.providerName as string,
        occurred: item.occurred,
      })) ?? []
    );
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
