import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";

import "next-auth/jwt";

import type { AuthenticationInfo } from "@descope/node-sdk";
import { skipCSRFCheck } from "@auth/core";
import Descope from "@auth/core/providers/descope";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createSdk } from "@descope/nextjs-sdk/server";
import { fromUnixTime } from "date-fns";
import gravatar from "gravatar";

import type { UserModel } from "@app/db/client";
import type { UserResponse } from "@app/utils";
import { db, repositories } from "@app/db/client";

import { env } from "../env";

const adapter = DrizzleAdapter(db);

export const isSecureContext = env.NODE_ENV !== "development";
export const descopeSdk = createSdk({
  projectId: env.NEXT_PUBLIC_AUTH_DESCOPE_ID || "",
  managementKey: env.AUTH_DESCOPE_MGT_KEY || "",
});
export const authConfig = {
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [
    Descope({
      clientId: env.AUTH_DESCOPE_ISSUER,
      clientSecret: env.AUTH_DESCOPE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/platform")) return !!auth;
      return true;
    },
  },
  debug: env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    user: {
      avatar: string;
      phone: string | null; // Add the 'phone' property
    } & DefaultSession["user"];
    userProfile: UserModel | null;
  }
}

const registerInitialUserForOnboarding = async (user: UserResponse) => {
  console.log(`check if user by id ${user.userId} need do onboarding`);
  const requiredOnborading = await repositories.user.HasUserNeedOnBoarding(
    user.userId,
  );
  if (requiredOnborading) {
    console.log(`user did onboarding ${user.userId} not required`);
    const splitName = user.name?.split(" ") ?? ["", ""];
    await repositories.user.Register({
      externalId: user.userId,
      firstName: splitName[0] ?? "",
      lastName: splitName[1] ?? "",
      avatar: user.picture ?? gravatar.url(user.email ?? "", { s: "200" }),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: user.email!,
      phone: "",
    });
  }
};

const sendAndParseUserInformation = async (
  userResp: UserResponse,
  authExpDate: number,
) => {
  const { userId } = userResp;
  const user = await repositories.user.GetUserShortInfoByExternalId(userId);
  return {
    user: {
      id: userId,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      avatar:
        user?.avatar ??
        userResp.picture ??
        gravatar.url(userResp.email ?? "", { s: "200" }),
      phone: user?.phone ?? null,
    },
    userProfile: user,
    expires: fromUnixTime(authExpDate).toISOString(),
  };
};

export const validateToken = async (
  token: string,
): Promise<{
  session: NextAuthSession;
  descopeSession: UserResponse | undefined;
  token: AuthenticationInfo | null;
  user: UserModel | null;
} | null> => {
  console.log(`validate token`);
  let sessionRes = null;
  try {
    sessionRes = await descopeSdk.validateSession(token);
    console.log(`user validated to user ${sessionRes.token.sub}`);
  } catch (error) {
    console.error("Could not validate user session ", error);
    return null;
  }
  const authToken = sessionRes.token;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = authToken.sub!;
  const res = await fetchCurrentDescopeUserDetails(userId);
  if (!res) {
    console.error("Could not load user info from descope ");
    return null;
  }
  const descopeUserInfo = res;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const authExpDate = authToken.exp!;
  let user = await repositories.user.GetUserShortInfoByExternalId(userId);
  console.log(`found user ${userId}`, user);
  if (!user) {
    console.warn(`User not register need onboarding ${userId}`);
    await registerInitialUserForOnboarding(descopeUserInfo);
    user = await repositories.user.GetUserShortInfoByExternalId(userId);
  }
  return {
    session: sendAndParseUserInformation(
      descopeUserInfo,
      authExpDate,
    ) as unknown as NextAuthSession,
    descopeSession: res as UserResponse,
    token: sessionRes,
    user: user,
  };
};

export const fetchCurrentDescopeUserDetails = async (externalId: string) => {
  console.log(`fetch user details ${externalId}`);
  const request = await descopeSdk.management.user.loadByUserId(externalId);
  if (request.ok) {
    return request.data;
  }
  return null;
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
