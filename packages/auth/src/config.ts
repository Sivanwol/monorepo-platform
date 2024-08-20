// TODO fix this eslint error and see how better handle
import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";

import "next-auth/jwt";

import { skipCSRFCheck } from "@auth/core";
import Descope from "@auth/core/providers/descope";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { createSdk } from "@descope/nextjs-sdk/server";
import { fromUnixTime } from "date-fns";

import type { MediaModel, UserModel } from "@app/db/client";
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
      image: string | null;
      imageMedia: MediaModel | null;
      phone: string | null; // Add the 'phone' property
    } & DefaultSession["user"];
    userProfile: UserModel | null;
  }
}

/** User base details from Descope API */
interface User {
  email?: string;
  name?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  phone?: string;
}
/** User extended details from Descope API */
type UserResponse = User & {
  loginIds: string[];
  userId: string;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
  picture?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customAttributes?: Record<string, any>;
  status: string;
};
const registerInitalUserForOnboarding = async (user: UserResponse) => {
  console.log(`check if user by id ${user.userId} need do onboarding`);
  const requiredOnborading = await repositories.user.HasUserNeedOnBoarding(
    user.userId,
  );
  if (requiredOnborading) {
    console.log(`user did onboarding ${user.userId} not required`);
    const splitName = user.name?.split(" ") ?? ["", ""];
    await repositories.user.register({
      externalId: user.userId,
      firstName: splitName[0] ?? "",
      lastName: splitName[1] ?? "",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: user.email!,
      phone: "",
    });
    return;
  }
};

const sendAndParseUserInformation = async (
  userResp: UserResponse,
  authExpDate: number,
) => {
  const { userId } = userResp;
  const user = await repositories.user.GetUserShortInfoByExternalId(userId);
  let avatarUrl = "";
  let media = null;
  if (user?.avatar) {
    media = await repositories.media.GetMediaById(user.avatar);
    avatarUrl = env.BLOB_STORAGE_URL + media?.path;
  }
  return {
    user: {
      id: userId,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      phone: user?.phone ?? null,
      imageMedia: media,
      image: user?.avatar ? avatarUrl : null,
    },
    userProfile: user,
    expires: fromUnixTime(authExpDate).toISOString(),
  };
};

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
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
  console.log(`locate user ${userId}`);
  console.log("sessionToken", authToken);
  let user = await repositories.user.GetUserShortInfoByExternalId(userId);
  console.log(`found user ${userId}`, user);
  if (!user) {
    console.warn(`User not register need onboarding ${userId}`);
    await registerInitalUserForOnboarding(descopeUserInfo);
    user = await repositories.user.GetUserShortInfoByExternalId(userId);
  }
  return sendAndParseUserInformation(descopeUserInfo, authExpDate);
};

export const fetchCurrentDescopeUserDetails = async (extrenalId: string) => {
  console.log(`fetch user details ${extrenalId}`);
  const request = await descopeSdk.management.user.loadByUserId(extrenalId);
  if (request.ok) {
    return request.data;
  }
  return null;
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
