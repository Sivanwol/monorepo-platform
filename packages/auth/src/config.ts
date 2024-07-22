/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// TODO fix this eslint error and see how better handle
import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
// import Apple from "next-auth/providers/apple";
// import CredentialsProvider from "next-auth/providers/credentials";
// import Facebook from "next-auth/providers/facebook";
// import Google from "next-auth/providers/google";
import Descope from "@auth/core/providers/descope";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { z } from "zod";

import { db, UserRepo } from "@app/db/client";
import {
  Account,
  Authenticators,
  Session,
  User,
  VerificationTokens,
} from "@app/db/schema";

// import { IsVerifyPassword, saltAndHashPassword } from "@app/utils";
// import { UserValidators } from "@app/validators";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: User,
  accountsTable: Account,
  sessionsTable: Session,
  verificationTokensTable: VerificationTokens,
  authenticatorsTable: Authenticators,
});

export const isSecureContext = env.NODE_ENV !== "development";

export const authBackofficeConfig = {
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [Descope],
  callbacks: {
    jwt({ token, trigger, user, session, account }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    session: (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
  debug: env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;

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
  providers: [Descope],
  callbacks: {
    jwt({ token, trigger, session, account }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    session: (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
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
