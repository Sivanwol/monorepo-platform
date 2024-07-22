import type { AuthenticationInfo } from "@descope/node-sdk";
import { session } from "@descope/nextjs-sdk/server";

export function auth(): null | AuthenticationInfo {
  const sessionRes = session();

  if (!sessionRes) return null;

  const stringJwt = sessionRes.jwt;
  const parsedJwt = sessionRes.token;
  const cookies = sessionRes.cookies;

  return sessionRes;
}

export function user() {}
