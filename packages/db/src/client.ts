import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { DrizzleLogger } from "./DrizzleLogger";
import {
  MediaRepository,
  NotificationRepository,
  UserRepository,
} from "./repositories";
import * as schema from "./schema";

export * from "./Models";
export const db = drizzle(sql, { schema, logger: new DrizzleLogger() });

export const repositories = {
  user: new UserRepository(db),
  notification: new NotificationRepository(db),
  media: new MediaRepository(db),
};
