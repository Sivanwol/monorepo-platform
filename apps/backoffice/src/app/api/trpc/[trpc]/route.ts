import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import SuperJSON from "superjson";

import { auth } from "@app/auth";
import { appRouter, createTRPCContext } from "@app/backoffice-api";
import { logger } from "@app/utils";

export const runtime = "edge";
/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = auth(async (req) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
      }),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async onError({ error, path, req }) {
      let input: Record<string, unknown> = {};
      if (req.method === "GET") {
        const { searchParams } = new URL(req.url);
        const param = searchParams.get("input") ?? "{}";

        input = JSON.parse(param);
      }
      if (req.method === "POST") {
        input = (await req.json()) as Record<string, unknown>;
      }
      logger.error(
        `>>> tRPC Error on '${path}' input ${SuperJSON.stringify(input)}`,
        error,
      );
    },
  });

  setCorsHeaders(response);
  return response;
});

export { handler as GET, handler as POST };
