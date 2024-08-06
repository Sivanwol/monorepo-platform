DO $$ BEGIN
 CREATE TYPE "public"."business_register_type" AS ENUM('Pature', 'Mass', 'Company');
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
 CREATE TYPE "public"."type" AS ENUM('personal', 'business', 'driver', 'driver+business');
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
	"owner_user_id" serial NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"allow_received_jobs" boolean DEFAULT false,
	"business_id" serial NOT NULL,
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
CREATE TABLE IF NOT EXISTS "business_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"logo_media_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"have_vehicles" boolean DEFAULT false,
	"display_language" json DEFAULT ('[]') NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver_licenses" (
	"driver_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"license_code" "license_code" DEFAULT 'A',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver_vehicles" (
	"vehicle_id" serial NOT NULL,
	"driver_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "driver_vehicles_driver_id_vehicle_id_pk" PRIMARY KEY("driver_id","vehicle_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alias" varchar(100) NOT NULL,
	"path" varchar(500) NOT NULL,
	"mine_type" varchar(100) NOT NULL,
	"size" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
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
	"avatar_media_id" serial NOT NULL,
	"is_worker" boolean DEFAULT false,
	"is_private" boolean DEFAULT false,
	"has_whatsup" boolean DEFAULT false,
	"gender" "gender" NOT NULL,
	"country" varchar(4) DEFAULT 'IL' NOT NULL,
	"state" varchar(4),
	"city" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"status" "status" DEFAULT 'single',
	"user_type" "type" DEFAULT 'driver' NOT NULL,
	"blocked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "user_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" serial NOT NULL,
	"note" varchar(500),
	"vehicle_image_id" serial NOT NULL,
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
 ALTER TABLE "business_type" ADD CONSTRAINT "business_type_logo_media_id_media_id_fk" FOREIGN KEY ("logo_media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
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
