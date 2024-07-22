import { Auth } from "@auth/core";
// import Apple from "next-auth/providers/apple";
// import Facebook from "next-auth/providers/facebook";
// import Google from "next-auth/providers/google";
import Descope from "@auth/core/providers/descope";
import { eventHandler, toWebRequest } from "h3";

export default eventHandler(async (event) =>
  Auth(toWebRequest(event), {
    basePath: "/r",
    secret: process.env.AUTH_SECRET,
    trustHost: !!process.env.VERCEL,
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    providers: [
      // Facebook({
      //   clientId: process.env.AUTH_FACEBOOK_ID,
      //   clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      // }),
      // Apple({
      //   clientId: process.env.AUTH_APPLE_ID,
      //   clientSecret: process.env.AUTH_APPLE_SECRET ?? "",
      // }),
      // Google({
      //   clientId: process.env.AUTH_GOOGLE_ID,
      //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // }),
      Descope({
        clientId: process.env.AUTH_DESCOPE_ID,
        clientSecret: process.env.AUTH_DESCOPE_SECRET,
        issuer: process.env.AUTH_DESCOPE_ISSUER,
      }),
    ],
  }),
);
