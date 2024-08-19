import { authMiddleware } from "@descope/nextjs-sdk/server";

import { env } from "./env";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { i18nRouter } from 'next-i18n-router';
import { languages, fallbackLng } from "./app/i18n/settings";

const middlewareFunctionsArray = {
  descopeAuth: authMiddleware({
    projectId: env.NEXT_PUBLIC_AUTH_DESCOPE_ID || "",
    redirectUrl: "/en/auth",
    publicRoutes: ["/", "/en", "/en/auth"],
  }),
  // i18n: (req: NextRequest) => i18nRouter(req, {
  //   locales: languages,
  //   defaultLocale: fallbackLng
  // })
};
const composeMiddlewares = (middlewares: Record<string, (req: NextRequest) => NextResponse | Promise<NextResponse>>) => {
  return (req: NextRequest) => {
    const parsedMiddlewares = Object.entries(middlewares);
    const initialResponse = Promise.resolve(NextResponse.next());

    return parsedMiddlewares.reduce((prevPromise, [middlewareName, middleware]) => {
      return prevPromise.then((res) => {
        if (res.status >= 300 && res.status < 500) {
          console.log(res)
          console.debug(`[middleware][skip] - ${middlewareName}`);
          return res;
        } else {
          console.debug(`[middleware] - ${middlewareName}`);
          return middleware(req);
        }
      })
    }, initialResponse);
  }
};
export default composeMiddlewares(middlewareFunctionsArray);
// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    '/',
    '/(en)/:path*',
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};
