import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "../schema";
import { and, eq } from "drizzle-orm";

export class UserRepository {
    constructor(public db: VercelPgDatabase<typeof schema>) {
    }

    public async GetUserByEmail(email: string): Promise<typeof schema.User.$inferSelect | null> {
        const user = await this.db.query.User.findFirst({ where: eq(schema.User.email, email) });
        return user ?? null;
    }

    public async IsMatchUserPassword(email: string, passwordHash: string): Promise<boolean> {
        if (email.trim() === '' || passwordHash.trim() === '') return false; // invalid input

        const user = await this.db.query.User.findFirst({ where: and(eq(schema.User.email, email.toLowerCase()), eq(schema.User.password, passwordHash)) });
        return !!user // found user with correct password

    }
}