import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { UserRepository } from "./repositories";
import { MediaRepository } from "./repositories/media.repository";
import * as schema from "./schema";

export * from "./Models";
export const db = drizzle(sql, { schema, logger: true });

export const repositories = {
  user: new UserRepository(db),
  media: new MediaRepository(db),
};
