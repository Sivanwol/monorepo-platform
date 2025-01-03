import type { AuthenticationInfo } from "@descope/node-sdk";
import { TRPCError } from "@trpc/server";

import { descopeSdk } from "@app/auth";
import { backofficePermmisions } from "@app/utils";

import type { ContextTRPC } from "./types";

export class BaseService {
  constructor(protected ctx: ContextTRPC) {
    this.ctx = ctx;
  }
  public verifyBackofficeAccess() {
    if (!this.verifyPermissions([backofficePermmisions.Access])) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });
    }
  }

  public verifyRoles(roles: string[]) {
    console.log(`verify access roles ${roles.toString()}`);
    if (roles.length === 0) {
      return true;
    }

    const validRoles = descopeSdk.validateTenantRoles(
      this.ctx.session.token as unknown as AuthenticationInfo,
      "T2lLM64ZZh1o1nAjWuWmSw1iA1Mu",
      roles,
    );
    if (!validRoles) {
      return false;
    }
    return true;
  }

  public verifyPermissions(permissions: string[]) {
    console.log(`verify access permissions ${permissions.toString()}`);
    if (permissions.length === 0) {
      return true;
    }
    const validPerm = descopeSdk.validateTenantPermissions(
      this.ctx.session.token as unknown as AuthenticationInfo,
      "T2lLM64ZZh1o1nAjWuWmSw1iA1Mu",
      permissions,
    );
    if (!validPerm) {
      return false;
    }
    return true;
  }
}
