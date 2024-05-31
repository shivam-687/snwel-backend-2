CREATE TABLE IF NOT EXISTS "course" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image" text,
	"shortDesc" text,
	"content" text DEFAULT ''
);
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "meta" json;