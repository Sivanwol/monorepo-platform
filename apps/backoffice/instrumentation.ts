import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("monorepo-platform-backoffice");
}
