import { authMiddleware } from "@descope/nextjs-sdk/server";

import { env } from "./env";

export default authMiddleware({
  projectId: env.NEXT_PUBLIC_AUTH_DESCOPE_ID || "",
  redirectUrl: "/auth",
  publicRoutes: ["/", "/auth"],
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
