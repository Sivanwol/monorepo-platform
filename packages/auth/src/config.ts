

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

import type { MediaModel, UserModel } from "@app/db/client";
import { db, repositories } from "@app/db/client";

import { env } from "../env";
const adapter = DrizzleAdapter(db);

import { createSdk } from '@descope/nextjs-sdk/server';
import { fromUnixTime } from "date-fns";
export const isSecureContext = env.NODE_ENV !== "development";
export const descopeSdk = createSdk({
  projectId: env.NEXT_PUBLIC_AUTH_DESCOPE_ID
})
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
    } & DefaultSession["user"];
    userProfile: UserModel | null;
  }
}

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  console.log(`validate token`)
  const sessionRes = await descopeSdk.validateJwt(token);
  console.log("session", sessionRes);
  if (!sessionRes) return null;
  const authToken = sessionRes.token;
  const userId = authToken.sub;
  console.log(`locate user ${userId}`)
  const user = await repositories.user.GetUserShortInfoByExternalId(userId!);
  if (!user) {
    console.error(`User not found for id ${userId}`);
    return null;
  }
  console.log("sessionToken", authToken);
  let avatarUrl = "";
  let media = null;
  if (user.avatar) {
    media = await repositories.media.GetMediaById(user.avatar);
    avatarUrl = env.BLOB_STORAGE_URL + media?.path
  }
  return sessionRes
    ? {
      user: {
        id: userId!,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        imageMedia: media,
        image: (user.avatar) ? avatarUrl : null,
      },
      userProfile: user ?? null,
      expires: fromUnixTime(authToken.exp!).toISOString(),
    }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
