import type { NextApiRequest, NextApiResponse } from "next";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

import { createCaller, createTRPCContext } from "@app/backoffice-api";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  console.log(`${req.method} /api/user/security`, params);
  const headers = new Headers();
  headers.set("Authorization", req.headers.get("authorization") || "");
  headers.set("Content-Type", "application/json");
  headers.set("x-trpc-source", "backoffice-api");
  console.log("headers", headers);
  const ctx = await createTRPCContext({ headers });
  const caller = createCaller(ctx);
  try {
    const data = await caller.user.securityAudit(parseInt(params.userId));
    console.log("data", data);
    return Response.json(data);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);

      return Response.json(
        { message: "Internal server error", cause, stack: cause.stack },
        { status: httpCode },
      );
    }
    // Another error occurred
    console.error(cause);
    return Response.json(
      { message: "Internal server error", cause },
      { status: 500 },
    );
  }
}
