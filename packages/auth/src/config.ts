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

import { db } from "@app/db/client";

import { env } from "../env";
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
      clientId: env.NEXT_PUBLIC_AUTH_DESCOPE_ID,
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


export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
