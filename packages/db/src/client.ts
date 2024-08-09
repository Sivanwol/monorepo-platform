import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";
import { UserRepository } from "./repositories";
import { MediaRepository } from "./repositories/media.repository";
export * from "./Models";
export const db = drizzle(sql, { schema });

export const repositories = {
  user: new UserRepository(db),
  media: new MediaRepository(db)
}
