DO $$ BEGIN
 CREATE TYPE "public"."days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
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
 CREATE TYPE "public"."notification_type" AS ENUM('UpdateUserProfile', 'CreateEntry', 'UpdateEntry', 'DeleteEntry');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client" (
	"id" serial PRIMARY KEY NOT NULL,
	"alias" varchar(255),
	"name" varchar(255) NOT NULL,
	"logo" integer,
	"lang_code" varchar(2) DEFAULT 'en',
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alias" varchar(100) NOT NULL,
	"path" varchar(500) NOT NULL,
	"mine_type" varchar(100) NOT NULL,
	"size" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now()
);
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
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(255),
	"client_id" integer,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"about_me" varchar(500),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"avatar" varchar(500) NOT NULL,
	"is_worker" boolean DEFAULT false,
	"is_private" boolean DEFAULT false,
	"has_whatsup" boolean DEFAULT false,
	"gender" "gender" DEFAULT 'other',
	"country" varchar(4) DEFAULT 'IL',
	"state" varchar(4),
	"city" varchar(255),
	"address" varchar(255),
	"onboarding_at" timestamp,
	"verify_phone_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now(),
	CONSTRAINT "user_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client" ADD CONSTRAINT "client_logo_media_id_fk" FOREIGN KEY ("logo") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
