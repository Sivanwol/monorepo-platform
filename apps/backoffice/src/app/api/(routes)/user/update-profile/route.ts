import type { NextApiRequest, NextApiResponse } from "next";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

import { createCaller, createTRPCContext } from "@app/backoffice-api";
import { logger } from "@app/utils";

export async function POST(req: Request) {
  await logger.info(`${req.method} /api/user/update-profile`, {
    payload: req.body,
  });
  const headers = new Headers();
  headers.set("Authorization", req.headers.get("authorization") ?? "");
  headers.set("Content-Type", "application/json");
  headers.set("x-trpc-source", "backoffice-api");
  console.log("headers", headers);
  const ctx = await createTRPCContext({ headers });
  const caller = createCaller(ctx);
  try {
    // const data = await caller.user.);
    // console.log("data", data);
    // return Response.json(data);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);

      return Response.json({
        message: "Internal server error",
        cause,
        success: false,
      });
    }
    // Another error occurred
    await logger.error(`${req.method} /api/user/update-profile error`, {
      cause,
    });
    return Response.json({
      message: "Internal server error",
      cause,
      success: false,
    });
  }
}
