import type { AuthenticationInfo } from "@descope/node-sdk";
import type { OpenApiMeta } from "trpc-openapi";
import { session } from "@descope/nextjs-sdk/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { v4 as uuidV4 } from "uuid";
import { ZodError } from "zod";

import { validateToken } from "@app/auth";
import { db, repositories } from "@app/db/client";

export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<{
  session: AuthenticationInfo | null;
  db: typeof db;
  repositories: typeof repositories;
  requestId: string;
  // eslint-disable-next-line @typescript-eslint/require-await
}> => {
  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  const descopeSession = session();
  const requestId = uuidV4();
  opts.headers.set("x-request-id", requestId);
  console.log(
    ">>> tRPC Request from",
    source,
    "at",
    new Date().toISOString() + "\n",
  );
  console.log(`checking session... ${descopeSession?.token.sub} `);
  let jwtSession: AuthenticationInfo | null = null;
  if (
    opts.headers.get("Authorization")?.replace("Bearer ", "") !== "" &&
    !descopeSession
  ) {
    jwtSession = {
      jwt: opts.headers.get("Authorization")?.replace("Bearer ", "") ?? "",
      token: {},
    };
  }
  return {
    session: descopeSession ?? jwtSession,
    db,
    repositories,
    requestId,
  };
};
/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
const isomorphicGetSession = async (session: AuthenticationInfo | null) => {
  console.log(`checking session... ${session?.token.sub} `);
  if (session) return validateToken(session.jwt);
  return {
    session: null,
    token: null,
    user: null,
    descopeSession: undefined,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
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
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const auth = await isomorphicGetSession(ctx.session);
  console.log(
    `incoming protected procedure... user id - ${JSON.stringify(auth?.user?.id)}... at $}{new Date().toISOString()}`,
  );
  if (!auth?.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `User not located user id - ${
        auth?.descopeSession?.userId ?? "N/A"
      } has no db record or not existed user`,
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      // session: { ...ctx.session },
      session: {
        cookies: ctx.session?.cookies,
        jwt: ctx.session?.jwt,
        token: auth.token,
        descopeUser: auth.descopeSession,
        user: auth.user,
        requestId: ctx.requestId,
      },
    },
  });
});