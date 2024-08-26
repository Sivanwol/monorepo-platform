/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // AUTH_DESCOPE_ID: z.string().min(1),
    BLOB_STORAGE_URL: z.string().min(1),
    KV_URL: z.string().min(1),
    KV_REST_API_URL: z.string().min(1),
    KV_REST_API_TOKEN: z.string().min(1),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
    AUTH_DESCOPE_SECRET: z.string().min(1),
    AUTH_DESCOPE_ISSUER: z.string().min(1),
    AUTH_DESCOPE_MGT_KEY: z.string().min(1),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "production"]).optional(),
  },
  client: {
    NEXT_PUBLIC_AUTH_DESCOPE_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_AUTH_DESCOPE_ID: process.env.NEXT_PUBLIC_AUTH_DESCOPE_ID,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
