ALTER TABLE "board_collaborator" ALTER COLUMN "collaborator_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "board_collaborator" ALTER COLUMN "collaborator_type" SET DEFAULT 'VIEWER'::text;--> statement-breakpoint
DROP TYPE "public"."collaborator_type";--> statement-breakpoint
CREATE TYPE "public"."collaborator_type" AS ENUM('VIEWER', 'EDITOR');--> statement-breakpoint
ALTER TABLE "board_collaborator" ALTER COLUMN "collaborator_type" SET DEFAULT 'VIEWER'::"public"."collaborator_type";--> statement-breakpoint
ALTER TABLE "board_collaborator" ALTER COLUMN "collaborator_type" SET DATA TYPE "public"."collaborator_type" USING "collaborator_type"::"public"."collaborator_type";