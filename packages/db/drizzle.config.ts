import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}
console.log(process.env.POSTGRES_URL);
const nonPoolingUrl = process.env.POSTGRES_URL.replace(":6543", ":5432");

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  out: "./migrations",
  dbCredentials: { url: nonPoolingUrl },
} satisfies Config;
