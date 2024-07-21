import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { UserRepository } from "./repositories/user";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const UserRepo = new UserRepository(db);
