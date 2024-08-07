import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { AuthenticationInfo } from "@descope/node-sdk";
import DescopeClient from '@descope/node-sdk';

import { auth, validateToken } from "@app/auth";
import { db } from "@app/db/client";
let descopeClient = undefined
try {
  //  baseUrl="<URL>" // When initializing the Descope clientyou can also configure the baseUrl ex: https://auth.company.com  - this is useful when you utilize CNAME within your Descope project.
  descopeClient = DescopeClient({ projectId: process.env.DESCOPE_PROJECT_ID || '' });
} catch (error) {
  // handle the error
  console.log("failed to initialize: " + error)
}

export const createTRPCContext = async (opts: {
  headers: Headers;
  jwt?: string;
}) => {
  const session = await descopeClient?.validateSession(opts.jwt ?? '') as AuthenticationInfo | null;
  const authToken = session?.token;

  const user = await descopeClient?.me()
  opts.headers.set("Authorization", `Bearer ${opts.jwt}`);
  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  console.log(">>> tRPC Request from", source, "by", user?.data);

  return {
    session,
    db,
    token: authToken,
    user: user?.data,
  };
};
/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.user },
    },
  });
});
