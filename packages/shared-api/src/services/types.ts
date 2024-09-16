import type { AuthenticationInfo } from "@descope/node-sdk";

import type { db, repositories, UserModel } from "@app/db/client";
import type { Gender, UserResponse } from "@app/utils";

export interface ContextTRPC {
  session: {
    cookies: string[] | undefined;
    jwt: string | undefined;
    token: AuthenticationInfo | null;
    descopeUser?: UserResponse;
    user: UserModel;
    requestId: string;
  };
  db: typeof db;
  repositories: typeof repositories;
  requestId: string;
}
