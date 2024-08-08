import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";
import { UserRepository } from "./repositories";

export const db = drizzle(sql, { schema });

export const repositories = {
  user: new UserRepository(db)
}
