ALTER TABLE "driver_licenses" ADD COLUMN "include_manual_license" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "is_manual" boolean DEFAULT false;