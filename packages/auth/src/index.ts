import NextAuth from "next-auth";

import { authConfig, descopeSdk } from "./config";

export type { Session } from "next-auth";

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut, descopeSdk };

export {
  invalidateSessionToken,
  validateToken,
  isSecureContext,
} from "./config";

export {
  createTRPCRouter,
  createTRPCContext,
  createCallerFactory,
  publicProcedure,
  protectedProcedure,
} from "./trpc";
