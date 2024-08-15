import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { and, eq } from "drizzle-orm";

import type { RegisterUserRequest } from "@app/utils";

import type { UserModel } from "../Models/user.model";
import { convertToUserModel } from "../Models/user.model";
import * as schema from "../schema";
import { CreateUserSchema, User } from "../schema";

export class UserRepository {
  constructor(public db: VercelPgDatabase<typeof schema>) {}

  public async GetUserById(
    user_id: number,
  ): Promise<typeof schema.User.$inferSelect | null> {
    console.log(`locate user ${user_id}`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.id, user_id),
    });
    return user ?? null;
  }

  public async locateUserByExternalId(external_id: string): Promise<boolean> {
    console.log(`locate user by external id ${external_id}`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.externalId, external_id),
    });
    return !!user;
  }
  public async GetUserShortInfoByExternalId(
    external_id: string,
  ): Promise<UserModel | null> {
    console.log(`get short info user by external id ${external_id}`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.externalId, external_id),
    });
    return user ? convertToUserModel(user) : null;
  }

  public async GetUsers(): Promise<(typeof schema.User.$inferSelect)[]> {
    console.log(`get users`);
    const users = await this.db.query.User.findMany();
    return users;
  }
  public async GetUserByEmail(
    email: string,
  ): Promise<typeof schema.User.$inferSelect | null> {
    console.log(`get user by email ${email}`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.email, email),
    });
    return user ?? null;
  }

  public async register(userData: RegisterUserRequest) {
    console.log(`verify user ${userData.externalId} payload `);
    const result = CreateUserSchema.safeParse(userData);
    if (result.success) {
      console.log(`insert user ${userData.externalId} payload `);
      await this.db.insert(User).values(result.data);
      return;
    }
    console.log(
      `verify user ${userData.externalId} payload failed `,
      result.error,
    );
  }
}
