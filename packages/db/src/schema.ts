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
  varchar,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const userStatusEnum = pgEnum('status', ['marry', 'willow', 'diverse', 'single']);
export const userTypeEnum = pgEnum('type', ['personal', 'business', 'driver', 'driver+business']);
export const driverLicenseCodeEnum = pgEnum('license_code', ['None', 'A1', 'A', 'B', 'C1', 'F', 'C', 'D', 'C+E']);
export const businessRegisterTypeEnum = pgEnum('business_register_type', ['Pature', 'Mass', 'Company']);
export const vehicleTypeEnum = pgEnum('vehicle_type', ['bike', 'car', 'motorcycle', 'bus', 'van', 'truck-sm', 'truck-big', 'semi-truck', 'other']);
export const totalEmployeeRangeEnum = pgEnum('total_employee_range', ['1-10', '10-50', '50-100', '100-200', '200+']);

export const Media = pgTable("media", {
  id: serial("id").primaryKey(),
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


export const Vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  vehicleType: vehicleTypeEnum("vehicle_type").default("car"),
  vehicleTypeOther: varchar("vehicle_type_other", { length: 255 }),
  hasCooling: boolean("has_cooling").default(false),
  hasInsurance: boolean("has_insurance").default(false),
  year: integer("year").default(0),
  licensePlate: varchar("license_plate", { length: 20 }).default(""),
  mileage: integer("mileage").default(0),
  checkoutAt: timestamp('checkout_at'),
  repairAt: timestamp('repair_at'),
  vehicleImageId: serial("vehicle_image_id")
    .references(() => Media.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const VehiclesRelations = relations(Vehicles, ({ one }) => ({
  media: one(Media, { fields: [Vehicles.id], references: [Media.id] })
}));

export const VehicleAudits = pgTable("vehicle_audits", {
  id: serial("id").primaryKey(),
  vehicleId: serial("vehicle_id")
    .references(() => Vehicles.id, { onDelete: "cascade" }),
  note: varchar("note", { length: 500 }),
  vehicleImageId: serial("vehicle_image_id")
    .references(() => Media.id, { onDelete: "cascade" }),
  mileage: integer("mileage").default(0),
  checkoutAt: timestamp('checkout_at'),
  repairAt: timestamp('repair_at'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const VehicleAuditsRelations = relations(Vehicles, ({ one }) => ({
  audit: one(VehicleAudits, { fields: [Vehicles.id], references: [VehicleAudits.vehicleId] }),
  media: one(Media, { fields: [Vehicles.id], references: [Media.id] })
}));

export const User = pgTable("user", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  aboutMe: varchar("about_me", { length: 500 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarMediaId: serial("avatar_media_id")
    .references(() => Media.id, { onDelete: "cascade" }),
  IsWorker: boolean("is_worker").default(false), // is this user is a worker (will not open a business entry)
  IsPrivate: boolean("is_private").default(false), // is this a private user
  hasWhatsup: boolean("has_whatsup").default(false),
  gender: genderEnum("gender").notNull(),
  country: varchar("country", { length: 4 }).notNull().default("IL"),
  state: varchar("state", { length: 4 }),
  city: varchar("city", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  status: userStatusEnum("status").default("single"),
  type: userTypeEnum("user_type").notNull().default("driver"),
  blockedAt: timestamp("blocked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const UserRelations = relations(User, ({ many, one }) => ({
  driver: one(Driver),
}));

export const Driver = pgTable(
  "driver",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    haveVehicles: boolean("have_vehicles").default(false),
    displayLanguage: json("display_language")
      .$type<string[]>()
      .notNull()
      .default(sql`('[]')`),
  }
);

export const DriverVehicles = pgTable("driver_vehicles", {
  vehicleId: serial("vehicle_id")
    .references(() => Vehicles.id, { onDelete: "cascade" }),
  driverId: serial("driver_id")
    .notNull()
    .references(() => Driver.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},
  (entity) => ({
    compositePK: primaryKey({
      columns: [entity.driverId, entity.vehicleId],
    }),
  })
);

export const DriverVehiclesRelations = relations(DriverVehicles, ({ many }) => ({
  drivers: many(Driver),
  vehicles: many(Vehicles),
}));

export const DriverLicenses = pgTable("driver_licenses", {
  driverId: serial("driver_id")
    .notNull()
    .references(() => Driver.id, { onDelete: "cascade" }),
  userId: serial("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  driverLicenseCode: driverLicenseCodeEnum("license_code").default("A"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const DriverRelations = relations(Driver, ({ one }) => ({
  user: one(User, { fields: [Driver.userId], references: [User.id] }),
  driver_licenses: one(DriverLicenses, { fields: [Driver.id], references: [DriverLicenses.driverId] }),
}));

export const BusinessType = pgTable("business_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo_media_id: serial("logo_media_id")
    .references(() => Media.id, { onDelete: "cascade" }),
});

export const Business = pgTable("business", {
  id: serial("id").primaryKey(),
  ownerUserId: serial("owner_user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  businessRegisterType: businessRegisterTypeEnum('business_register_type'),
  businessTypeId: serial("business_type_id")
    .references(() => BusinessType.id, { onDelete: "cascade" }),
  logoMediaId: serial("logo_media_id")
    .references(() => Media.id, { onDelete: "cascade" }),
  country: varchar("country", { length: 4 }).notNull().default("IL"),
  state: varchar("state", { length: 4 }),
  city: varchar("city", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  fax: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const BusinessRelations = relations(Business, ({ one }) => ({
  user: one(User, { fields: [Business.ownerUserId], references: [User.id] }),
}));

export const BusinessMetaData = pgTable("business_metadata", {
  id: serial("id").primaryKey(),
  allowReceivedJobs: boolean("allow_received_jobs").default(false),
  businessId: serial("business_id").references(() => Business.id, { onDelete: "cascade" }),
  totalEmployeeRange: totalEmployeeRangeEnum("total_employee_range").default("1-10"),
  whatsup: varchar("phone", { length: 20 }),
  tiktok: varchar('tiktok', { length: 255 }),
  facebook: varchar('facebook', { length: 255 }),
  instagram: varchar('instagram', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),
  operatedWithin90Min: boolean("operated_within_90_min").default(false),
  operatedWithin72Hours: boolean("operated_within_72_hours").default(false),
  operatedWithin7Days: boolean("operated_within_7_days").default(false),
  operatedWithin14Days: boolean("operated_within_14_days").default(false),
});

export const BusinessMetaDataRelations = relations(BusinessMetaData, ({ one }) => ({
  business: one(Business, { fields: [BusinessMetaData.businessId], references: [Business.id] })
}));

