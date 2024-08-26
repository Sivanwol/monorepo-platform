import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const daysEnum = pgEnum("days", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export type notificationType = "UpdateUserProfile" | "CreateEntry" | "UpdateEntry" | "DeleteEntry";
export const notificationTypeEnum = pgEnum("notification_type", [
  "UpdateUserProfile",
  "CreateEntry",
  "UpdateEntry",
  "DeleteEntry",
]);

export const Media = pgTable("media", {
  id: serial("id").primaryKey(),
  alias: varchar("alias", { length: 100 }).notNull(),
  path: varchar("path", { length: 500 }).notNull(),
  mineType: varchar("mine_type", { length: 100 }).notNull(),
  size: bigint("size", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateMediaSchema = createInsertSchema(Media, {
  alias: z.string().min(2).max(100),
  path: z.string().min(5).max(500),
  mineType: z.string().min(5).max(100),
  size: z.number().int().positive().gt(0),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const User = pgTable("user", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  clientId: integer("client_id").references(() => Client.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  aboutMe: varchar("about_me", { length: 500 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarMediaId: integer("avatar_media_id").references(() => Media.id, {
    onDelete: "cascade",
  }),
  IsWorker: boolean("is_worker").default(false), // is this user is a worker (will not open a business entry)
  IsPrivate: boolean("is_private").default(false), // is this a private user
  hasWhatsup: boolean("has_whatsup").default(false),
  gender: genderEnum("gender").default("other"),
  country: varchar("country", { length: 4 }).default("IL"),
  state: varchar("state", { length: 4 }),
  city: varchar("city", { length: 255 }),
  address: varchar("address", { length: 255 }),
  onboarding: boolean("onboarding"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateUserSchema = createInsertSchema(User, {
  externalId: z.string().min(2).max(255),
  email: z.string().email(),
  firstName: z.string().min(2).max(100).optional().or(z.literal("")),
  lastName: z.string().min(2).max(100).optional().or(z.literal("")),
  phone: z.string().min(2).max(20).optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  onboarding: true,
});

export const Notification = pgTable("notification", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => User.id, { onDelete: "cascade" }),
  affectedEntity: varchar("affected_entity", { length: 255 }).notNull(),
  affectedEntityId: integer("affected_entity_id").notNull(),
  metaData: json("meta_data").default({}),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: varchar("body", { length: 500 }).notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateNotificationSchema = createInsertSchema(Notification, {
  userId: z.number().int().positive().gt(0),
  affectedEntityId: z.number().int().positive().gt(0).optional(),
  type: z.string().min(2).max(255),
  title: z.string().min(2).max(255),
  body: z.string().min(2).max(500),
  read: z.boolean().default(false),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Client = pgTable("client", {
  id: serial("id").primaryKey(),
  alias: varchar("alias", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  logo: integer("logo").references(() => Media.id, { onDelete: "cascade" }),
  lang_code: varchar("lang_code", { length: 2 }).default("en"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});
