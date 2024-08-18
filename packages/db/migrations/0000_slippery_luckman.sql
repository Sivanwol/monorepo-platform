DO $$ BEGIN
 CREATE TYPE "public"."business_register_type" AS ENUM('Pature', 'Mass', 'Company');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."license_code" AS ENUM('None', 'A1', 'A', 'B', 'C1', 'F', 'C', 'D', 'C+E');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."operation_area" AS ENUM('north', 'sharon', 'west', 'south', 'jerusalem area', 'all country');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."total_employee_range" AS ENUM('1-10', '10-50', '50-100', '100-200', '200+');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('marry', 'willow', 'diverse', 'single');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('private', 'business', 'driver', 'driver+business');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."vehicle_type" AS ENUM('bike', 'car', 'motorcycle', 'bus', 'van', 'truck-sm', 'truck-big', 'semi-truck', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"business_register_type" "business_register_type",
	"business_type_id" serial NOT NULL,
	"logo_media_id" serial NOT NULL,
	"country" varchar(4) DEFAULT 'IL' NOT NULL,
	"state" varchar(4),
	"city" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"updatedAt" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer,
	"allow_received_jobs" boolean DEFAULT false,
	"total_employee_range" "total_employee_range" DEFAULT '1-10',
	"phone" varchar(20),
	"tiktok" varchar(255),
	"facebook" varchar(255),
	"instagram" varchar(255),
	"twitter" varchar(255),
	"operated_within_90_min" boolean DEFAULT false,
	"operated_within_72_hours" boolean DEFAULT false,
	"operated_within_7_days" boolean DEFAULT false,
	"operated_within_14_days" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_operate_days_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer,
	"day" "days" NOT NULL,
	"open_24_hour" boolean DEFAULT false,
	"open_from1" time,
	"open_to1" time,
	"open_from2" time,
	"open_to2" time,
	"updatedAt" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_operation_area" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer,
	"operation_area" "operation_area" DEFAULT 'all country',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo_media_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_vehicles" (
	"vehicle_id" integer,
	"business_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_vehicles_business_id_vehicle_id_pk" PRIMARY KEY("business_id","vehicle_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"have_vehicles" boolean DEFAULT false,
	"display_language" json DEFAULT ('[]') NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver_licenses" (
	"driver_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"include_manual_license" boolean DEFAULT false,
	"license_code" "license_code" DEFAULT 'A',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driver_licenses_driver_id_user_id_pk" PRIMARY KEY("driver_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver_vehicles" (
	"vehicle_id" integer,
	"driver_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driver_vehicles_driver_id_vehicle_id_pk" PRIMARY KEY("driver_id","vehicle_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alias" varchar(100) NOT NULL,
	"path" varchar(500) NOT NULL,
	"mine_type" varchar(100) NOT NULL,
	"size" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"about_me" varchar(500),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"avatar_media_id" integer,
	"is_worker" boolean DEFAULT false,
	"is_private" boolean DEFAULT false,
	"has_whatsup" boolean DEFAULT false,
	"gender" "gender" DEFAULT 'other',
	"country" varchar(4) DEFAULT 'IL',
	"state" varchar(4),
	"city" varchar(255),
	"address" varchar(255),
	"status" "status" DEFAULT 'single',
	"user_type" "type" DEFAULT 'driver',
	"onboarding" boolean,
	"blocked" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "user_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer,
	"note" varchar(500),
	"vehicle_image_id" integer,
	"mileage" integer DEFAULT 0,
	"checkout_at" timestamp,
	"repair_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_type" "vehicle_type" DEFAULT 'car',
	"vehicle_type_other" varchar(255),
	"has_cooling" boolean DEFAULT false,
	"has_insurance" boolean DEFAULT false,
	"is_manual" boolean DEFAULT false,
	"year" integer DEFAULT 0,
	"license_plate" varchar(20) DEFAULT '',
	"mileage" integer DEFAULT 0,
	"checkout_at" timestamp,
	"repair_at" timestamp,
	"vehicle_image_id" serial NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business" ADD CONSTRAINT "business_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business" ADD CONSTRAINT "business_business_type_id_business_type_id_fk" FOREIGN KEY ("business_type_id") REFERENCES "public"."business_type"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business" ADD CONSTRAINT "business_logo_media_id_media_id_fk" FOREIGN KEY ("logo_media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_metadata" ADD CONSTRAINT "business_metadata_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_operate_days_hours" ADD CONSTRAINT "business_operate_days_hours_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_operation_area" ADD CONSTRAINT "business_operation_area_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_type" ADD CONSTRAINT "business_type_logo_media_id_media_id_fk" FOREIGN KEY ("logo_media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_vehicles" ADD CONSTRAINT "business_vehicles_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_vehicles" ADD CONSTRAINT "business_vehicles_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver" ADD CONSTRAINT "driver_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver_licenses" ADD CONSTRAINT "driver_licenses_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver_licenses" ADD CONSTRAINT "driver_licenses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver_vehicles" ADD CONSTRAINT "driver_vehicles_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver_vehicles" ADD CONSTRAINT "driver_vehicles_driver_id_driver_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_avatar_media_id_media_id_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_audits" ADD CONSTRAINT "vehicle_audits_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_audits" ADD CONSTRAINT "vehicle_audits_vehicle_image_id_media_id_fk" FOREIGN KEY ("vehicle_image_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicle_image_id_media_id_fk" FOREIGN KEY ("vehicle_image_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
