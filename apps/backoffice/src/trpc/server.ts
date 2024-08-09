import { cache } from "react";
import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import DescopeClient from '@descope/node-sdk';
import type { AppRouter } from "@app/backoffice-api";
import { auth } from "@app/auth";
import { createCaller, createTRPCContext } from "@app/backoffice-api";
import { createQueryClient } from "./query-client";
import { NextRequest } from "next/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});


const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
