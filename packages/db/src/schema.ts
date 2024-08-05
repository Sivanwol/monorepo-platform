import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  decimal,
  pgTable,
  json,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const userStatusEnum = pgEnum('status', ['marry', 'willow', 'diverse', 'single']);
export const userTypeEnum = pgEnum('type', ['personal', 'business', 'driver', 'driver+business']);
export const driverLicenseCodeEnum = pgEnum('license_code', ['None', 'A', 'B', 'C1', 'C', 'D', 'C+E']);

export const Media = pgTable("media", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  alias: varchar("alias", { length: 100 }).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  mineType: varchar("mine_type", { length: 100 }).notNull(),
  size: decimal("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateMediaSchema = createInsertSchema(Media, {
  alias: z.string().min(2).max(100),
  path: z.string().min(5).max(500),
  mineType: z.string().min(5).max(100),
  size: z.number().gt(0)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  aboutMe: varchar("about_me", { length: 500 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarMediaId: uuid("avatar_media_id")
    .references(() => Media.id, {}),
  hasWhatsup: boolean("has_whatsup").default(false),
  gender: genderEnum("gender").notNull(),
  country: varchar("country", { length: 4 }).notNull().default("IL"),
  state: varchar("state", { length: 4 }),
  city: varchar("city", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  status: userStatusEnum("status").default("single"),
  type: userTypeEnum("type").notNull().default("driver"),
  blockedAt: timestamp("created_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const UserRelations = relations(User, ({ many, one }) => ({
  // driver: one(Driver),
}));

export const Driver = pgTable(
  "driver",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    driverLicenseCode: driverLicenseCodeEnum("license_code").default("A"),
    tzNumber: integer("tz_number").default(9),
    tzMediaId: uuid("tz_media_id").references(() => Media.id, {}),
    businessNumber: varchar("business_numbers", { length: 255 }),
    haveVehicles: boolean("have_vehicles").default(false),
    displayLanguage: json("display_language")
      .$type<string[]>()
      .notNull()
      .default(sql`('[]')`),
  }
);

export const DriverRelations = relations(Driver, ({ one }) => ({
  user: one(User, { fields: [Driver.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

export const VerificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);
export const Authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);
