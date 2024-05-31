CREATE TABLE IF NOT EXISTS "blog" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"shortDesc" text,
	"content" text,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
