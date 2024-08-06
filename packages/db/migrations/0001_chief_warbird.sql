DO $$ BEGIN
 CREATE TYPE "public"."days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
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
CREATE TABLE IF NOT EXISTS "business_operate_days_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" serial NOT NULL,
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
	"business_id" serial NOT NULL,
	"operation_area" "operation_area" DEFAULT 'all country',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_vehicles" (
	"vehicle_id" serial NOT NULL,
	"business_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_vehicles_business_id_vehicle_id_pk" PRIMARY KEY("business_id","vehicle_id")
);
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
