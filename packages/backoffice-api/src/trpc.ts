import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { session } from '@descope/nextjs-sdk/server'
import type { AuthenticationInfo } from '@descope/node-sdk';
import { db, repositories } from "@app/db/client";
import type { User } from "@app/db/schema";
import { auth, validateToken } from "@app/auth";
import type { UserModel } from '@app/db/client';
export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<{
  session: AuthenticationInfo | null,
  db: typeof db,
  user: UserModel | null,
}> => {
  const source = opts.headers.get("x-trpc-source") ?? "unknown";
  console.log(">>> tRPC Request from", source, "at", new Date().toISOString() + "\n");
  return {
    session: session() ?? null,
    db,
    user: null,
  };
};
/**
* Isomorphic Session getter for API requests
* - Expo requests will have a session token in the Authorization header
* - Next.js requests will have a session token in cookies
*/
const isomorphicGetSession = async (session: AuthenticationInfo | null) => {
  // const authToken = headers.get("Authorization") ?? null;
  console.log(`checking session... ${session?.token.sub} `);
  if (session) return validateToken(session.jwt);
  return auth();
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
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const auth = await isomorphicGetSession(ctx.session);

  console.log(`incoming protected procedure... ${JSON.stringify(auth)}...`);
  // if (!ctx.user) {
  //   throw new TRPCError({ code: "UNAUTHORIZED" });
  // }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      // session: { ...ctx.session, user: ctx.user },
      session: {
        user: {
          id: 0,
          firstName: "test",
          lastName: "user",
          email: "test@test.com",
          phone: "1234567890",
          country: 'israel',
          city: 'tel aviv',
          type: 'private',
          createdAt: new Date(),
          gender: "male",
        }
      },
    },
  });
});
