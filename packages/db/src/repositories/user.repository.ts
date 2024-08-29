import type { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { and, eq, isNull, or } from "drizzle-orm";

import type { OnBoardAdminUserRequest, RegisterUserRequest } from "@app/utils";

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

  public async locateUserByExternalId(externalId: string): Promise<boolean> {
    console.log(`locate user by external id ${externalId}`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.externalId, externalId),
    });
    return !!user;
  }
  public async GetUserShortInfoByExternalId(
    externalId: string,
  ): Promise<UserModel | null> {
    console.log(`get short info user by external id ${externalId}`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.externalId, externalId),
    });
    return user ? convertToUserModel(user) : null;
  }

  public async HasUserExist(userId: number): Promise<boolean> {
    console.log(`check user ${userId} exist`);
    const user = await this.db.query.User.findFirst({
      where: eq(schema.User.id, userId),
    });
    return !!user;
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
  public async HasUserNeedOnBoarding(externalId: string): Promise<boolean> {
    console.log(`check user ${externalId} need onboarding`);
    const user = await this.db.query.User.findFirst({
      where: and(eq(User.externalId, externalId), isNull(User.onboardingAt)),
    });
    return !user;
  }

  /**
   * feedback loop via descope for register user happened both in login and register
   * @param userData user data
   */
  public async Register(userData: RegisterUserRequest) {
    console.log(`verify user ${userData.externalId} payload `);
    const result = CreateUserSchema.safeParse(userData);
    if (result.success) {
      console.log(`insert user ${userData.externalId} payload `);
      await this.db.insert(User).values({
        externalId: userData.externalId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar,
        phone: userData.phone,
      });
      return;
    }
    console.log(
      `verify user ${userData.externalId} payload failed `,
      result.error,
    );
  }

  public async BoardingAdminUser(
    userId: number,
    payload: OnBoardAdminUserRequest,
  ) {
    console.log(`update user ${userId} onboarding`);
    if (await this.HasUserExist(userId)) {
      const user = await this.db.query.User.findFirst({
        where: eq(schema.User.id, userId),
      });
      await this.db
        .update(User)
        .set({
          firstName: payload.firstName,
          lastName: payload.lastName,
          gender: payload.gender,
          aboutMe: payload.aboutMe ?? user?.aboutMe,
          avatar: payload.avatar ?? user?.avatar,
          onboardingAt: new Date(),
        })
        .where(eq(User.id, userId));
      // #TODO: add login when user enter phone MFA is enforce also when user do login MFA will be required (check ways do so on descope!)
      if (payload.phone) {
        await this.db
          .update(User)
          .set({
            phone: payload.phone,
            verifyPhoneAt: null,
          })
          .where(eq(User.id, userId));
      } else {
        console.log(`user ${userId} not exist`);
      }
    }
  }
}
