import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const userStatusEnum = pgEnum("status", [
  "marry",
  "willow",
  "diverse",
  "single",
]);

export const userTypeEnum = pgEnum("type", [
  "private",
  "business",
  "driver",
  "driver+business",
]);

export const driverLicenseCodeEnum = pgEnum("license_code", [
  "None",
  "A1",
  "A",
  "B",
  "C1",
  "F",
  "C",
  "D",
  "C+E",
]);

export const businessRegisterTypeEnum = pgEnum("business_register_type", [
  "Pature",
  "Mass",
  "Company",
]);

export const vehicleTypeEnum = pgEnum("vehicle_type", [
  "bike",
  "car",
  "motorcycle",
  "bus",
  "van",
  "truck-sm",
  "truck-big",
  "semi-truck",
  "other",
]);
export const totalEmployeeRangeEnum = pgEnum("total_employee_range", [
  "1-10",
  "10-50",
  "50-100",
  "100-200",
  "200+",
]);

export const operationAreaEnum = pgEnum("operation_area", [
  "north",
  "sharon",
  "west",
  "south",
  "jerusalem area",
  "all country",
]);

export const daysEnum = pgEnum("days", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
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

export const Vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  vehicleType: vehicleTypeEnum("vehicle_type").default("car"),
  vehicleTypeOther: varchar("vehicle_type_other", { length: 255 }),
  hasCooling: boolean("has_cooling").default(false),
  hasInsurance: boolean("has_insurance").default(false),
  isManual: boolean("is_manual").default(false),
  year: integer("year").default(0),
  licensePlate: varchar("license_plate", { length: 20 }).default(""),
  mileage: integer("mileage").default(0),
  checkoutAt: timestamp("checkout_at"),
  repairAt: timestamp("repair_at"),
  vehicleImageId: serial("vehicle_image_id").references(() => Media.id, {
    onDelete: "cascade",
  }),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const VehiclesRelations = relations(Vehicles, ({ many, one }) => ({
  media: one(Media, { fields: [Vehicles.id], references: [Media.id] }),
  businessVehicles: many(BusinessVehicles),
}));

export const VehicleAudits = pgTable("vehicle_audits", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => Vehicles.id, {
    onDelete: "cascade",
  }),
  note: varchar("note", { length: 500 }),
  vehicleImageId: integer("vehicle_image_id").references(() => Media.id, {
    onDelete: "cascade",
  }),
  mileage: integer("mileage").default(0),
  checkoutAt: timestamp("checkout_at"),
  repairAt: timestamp("repair_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const VehicleAuditsRelations = relations(Vehicles, ({ one }) => ({
  audit: one(VehicleAudits, {
    fields: [Vehicles.id],
    references: [VehicleAudits.vehicleId],
  }),
  media: one(Media, { fields: [Vehicles.id], references: [Media.id] }),
}));

export const User = pgTable("user", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
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
  status: userStatusEnum("status").default("single"),
  type: userTypeEnum("user_type").default("driver"),
  blockedAt: timestamp("blocked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const CreateUserSchema = createInsertSchema(User, {
  externalId: z.string().min(2).max(255),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(2).max(20).optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserRelations = relations(User, ({ many, one }) => ({
  driver: one(Driver),
}));

export const Driver = pgTable("driver", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  haveVehicles: boolean("have_vehicles").default(false),
  displayLanguage: json("display_language")
    .$type<string[]>()
    .notNull()
    .default(sql`('[]')`),
});

export const DriverVehicles = pgTable(
  "driver_vehicles",
  {
    vehicleId: integer("vehicle_id").references(() => Vehicles.id, {
      onDelete: "cascade",
    }),
    driverId: integer("driver_id")
      .notNull()
      .references(() => Driver.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (entity) => ({
    compositePK: primaryKey({
      columns: [entity.driverId, entity.vehicleId],
    }),
  }),
);

export const DriverVehiclesRelations = relations(
  DriverVehicles,
  ({ many }) => ({
    drivers: many(Driver),
    vehicles: many(Vehicles),
  }),
);

export const DriverLicenses = pgTable(
  "driver_licenses",
  {
    driverId: integer("driver_id")
      .notNull()
      .references(() => Driver.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    IncludeManualLicense: boolean("include_manual_license").default(false),
    driverLicenseCode: driverLicenseCodeEnum("license_code").default("A"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (entity) => ({
    compositePK: primaryKey({
      columns: [entity.driverId, entity.userId],
    }),
  }),
);

export const DriverRelations = relations(Driver, ({ one }) => ({
  user: one(User, { fields: [Driver.userId], references: [User.id] }),
  driver_licenses: one(DriverLicenses, {
    fields: [Driver.id],
    references: [DriverLicenses.driverId],
  }),
}));

export const BusinessType = pgTable("business_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo_media_id: integer("logo_media_id").references(() => Media.id, {
    onDelete: "cascade",
  }),
});

export const Business = pgTable("business", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  businessRegisterType: businessRegisterTypeEnum("business_register_type"),
  businessTypeId: serial("business_type_id").references(() => BusinessType.id, {
    onDelete: "cascade",
  }),
  logoMediaId: serial("logo_media_id").references(() => Media.id, {
    onDelete: "cascade",
  }),
  country: varchar("country", { length: 4 }).notNull().default("IL"),
  state: varchar("state", { length: 4 }),
  city: varchar("city", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  fax: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const BusinessRelations = relations(Business, ({ many, one }) => ({
  user: one(User, { fields: [Business.ownerUserId], references: [User.id] }),
  businessVehicles: many(BusinessVehicles),
  businessOperateDaysHours: many(BusinessOperateDaysHours),
}));

export const BusinessMetaData = pgTable("business_metadata", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => Business.id, {
    onDelete: "cascade",
  }),
  allowReceivedJobs: boolean("allow_received_jobs").default(false),
  totalEmployeeRange: totalEmployeeRangeEnum("total_employee_range").default(
    "1-10",
  ),
  whatsup: varchar("phone", { length: 20 }),
  tiktok: varchar("tiktok", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  instagram: varchar("instagram", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  operatedWithin90Min: boolean("operated_within_90_min").default(false),
  operatedWithin72Hours: boolean("operated_within_72_hours").default(false),
  operatedWithin7Days: boolean("operated_within_7_days").default(false),
  operatedWithin14Days: boolean("operated_within_14_days").default(false),
});

export const BusinessMetaDataRelations = relations(
  BusinessMetaData,
  ({ one }) => ({
    business: one(Business, {
      fields: [BusinessMetaData.businessId],
      references: [Business.id],
    }),
  }),
);

export const BusinessOperationArea = pgTable("business_operation_area", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => Business.id, {
    onDelete: "cascade",
  }),
  operationArea: operationAreaEnum("operation_area").default("all country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const BusinessOperationAreaRelations = relations(
  BusinessOperationArea,
  ({ one }) => ({
    business: one(Business, {
      fields: [BusinessOperationArea.businessId],
      references: [Business.id],
    }),
  }),
);

export const BusinessOperateDaysHours = pgTable("business_operate_days_hours", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => Business.id, {
    onDelete: "cascade",
  }),
  day: daysEnum("day").notNull(),
  open24Hour: boolean("open_24_hour").default(false),
  openFrom1: time("open_from1"),
  openTo1: time("open_to1"),
  openFrom2: time("open_from2"),
  openTo2: time("open_to2"),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const BusinessOperateDaysHoursRelations = relations(
  BusinessOperateDaysHours,
  ({ many }) => ({
    business: many(Business),
  }),
);

export const BusinessVehicles = pgTable(
  "business_vehicles",
  {
    vehicleId: integer("vehicle_id").references(() => Vehicles.id, {
      onDelete: "cascade",
    }),
    businessId: integer("business_id")
      .notNull()
      .references(() => Business.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (entity) => ({
    compositePK: primaryKey({
      columns: [entity.businessId, entity.vehicleId],
    }),
  }),
);

export const BusinessVehiclesRelations = relations(
  BusinessVehicles,
  ({ many }) => ({
    business: many(Business),
    vehicles: many(Vehicles),
  }),
);
