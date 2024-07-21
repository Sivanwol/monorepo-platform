import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";
import { UserRepository } from "./repositories/user";

export const db = drizzle(sql, { schema });

export const UserRepo = new UserRepository(db);