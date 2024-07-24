import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel("sabu-platform-backoffice");
}
