import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Google from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'


import { db, UserRepo } from "@app/db/client";
import { Account, Session, User, VerificationTokens, Authenticators } from "@app/db/schema";
import { UserValidators } from "@app/validators";
import { saltAndHashPassword, IsVerifyPassword } from "@app/utils";

import { env } from "../env";
import { z } from "zod";

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
  authenticatorsTable: Authenticators
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
  providers: [Google, Facebook, CredentialsProvider({
    credentials: {
      email: {},
      password: {},
    },
    async authorize(credentials) {
      let user = null;
      try {
        const parsedCredentials = await UserValidators.signInSchema.parseAsync(credentials);
        const { email, password } = parsedCredentials;

        // logic to salt and hash password
        const pwHash = saltAndHashPassword(password);
        user = await UserRepo.GetUserByEmail(email);
        if (user) {
          const userMatch = await UserRepo.IsMatchUserPassword(email, pwHash);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (userMatch && IsVerifyPassword(credentials.password as string, user.password!)) {
            console.info(`User login ${user.email}`);
            return user;
          }
        }
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          // Handle Zod validation errors
          console.error("Validation error:", error.message);
        } else {
          // Handle other errors
          console.error("Error:", error);
        }
      }
      return user;
    },
  })],
  callbacks: {
    jwt({ token, trigger, user, session, account }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
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
  providers: [Apple, Google, Facebook],
  callbacks: {
    jwt({ token, trigger, session, account }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
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
