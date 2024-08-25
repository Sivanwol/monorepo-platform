DO $$ BEGIN
 CREATE TYPE "public"."notification_type" AS ENUM('UpdateUserProfile', 'CreateEntry', 'UpdateEntry', 'DeleteEntry');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"affected_entity" varchar(255) NOT NULL,
	"affected_entity_id" integer NOT NULL,
	"meta_data" json DEFAULT '{}'::json,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" varchar(500) NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
