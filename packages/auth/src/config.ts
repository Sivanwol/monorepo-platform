/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { z } from "zod";

import { db, UserRepo } from "@app/db/client";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter = DrizzleAdapter(db);

export const isSecureContext = env.NODE_ENV !== "development";

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
      clientId: env.AUTH_DESCOPE_ID,
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

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
      user: {
        ...session.user,
      },
      expires: session.session.expires.toISOString(),
    }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
