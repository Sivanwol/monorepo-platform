CREATE TABLE IF NOT EXISTS "activity_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" varchar(255) NOT NULL,
	"entity" varchar(255) NOT NULL,
	"entity_id" integer NOT NULL,
	"meta_data" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
