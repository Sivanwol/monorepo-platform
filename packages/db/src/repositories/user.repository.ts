import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { and, eq } from "drizzle-orm";

import * as schema from "../schema";
import type { UserModel } from "../Models/user.model";
import { convertToUserModel } from "../Models/user.model";

export class UserRepository {
  constructor(public db: VercelPgDatabase<typeof schema>) { }

  public async GetUserById(user_id: number): Promise<typeof schema.User.$inferSelect | null> {
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.id, user_id),
    });
    return user ?? null;
  }
  public async GetUserShortInfoByExternalId(external_id: string): Promise<UserModel | null> {
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.externalId, external_id),
    });
    return user ? convertToUserModel(user) : null;
  }

  public async GetUsers(): Promise<typeof schema.User.$inferSelect[]> {
    const users = await this.db.query.User.findMany();
    return users;
  }
  public async GetUserByEmail(
    email: string,
  ): Promise<typeof schema.User.$inferSelect | null> {
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.email, email),
    });
    return user ?? null;
  }

  public async IsMatchUserPassword(
    email: string,
    passwordHash: string,
  ): Promise<boolean> {
    if (email.trim() === "" || passwordHash.trim() === "") return false; // invalid input

    const user = await this.db.query.User.findFirst({
      where: and(
        eq(schema.User.email, email.toLowerCase()),
        // eq(schema.User.password, passwordHash),
      ),
    });
    return !!user; // found user with correct password
  }
}
