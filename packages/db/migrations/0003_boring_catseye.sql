ALTER TABLE "user" RENAME COLUMN "avatar_media_id" TO "avatar";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_avatar_media_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "avatar" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "avatar" SET NOT NULL;