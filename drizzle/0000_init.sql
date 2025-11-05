CREATE TYPE "public"."collaborator_type" AS ENUM('EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."shape_type" AS ENUM('RECTANGLE', 'CIRCLE', 'LINE', 'TRIANGLE');--> statement-breakpoint
CREATE TABLE "board_collaborator" (
	"collaborator_id" integer NOT NULL,
	"board_id" integer NOT NULL,
	"collaborator_type" "collaborator_type",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "board_collaborator_collaborator_id_board_id_pk" PRIMARY KEY("collaborator_id","board_id")
);
--> statement-breakpoint
CREATE TABLE "board" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "board_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"board_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"owner_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "board_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "element" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "element_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"shape_type" "shape_type",
	"shape_properties" jsonb,
	"board_id" integer NOT NULL,
	"update_by_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" integer,
	"email" varchar(255) NOT NULL,
	"profile_pic" varchar(255),
	CONSTRAINT "user_profile_user_id_pk" PRIMARY KEY("user_id"),
	CONSTRAINT "user_profile_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "user_userName_unique" UNIQUE("user_name")
);
--> statement-breakpoint
ALTER TABLE "board_collaborator" ADD CONSTRAINT "board_collaborator_collaborator_id_user_id_fk" FOREIGN KEY ("collaborator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_collaborator" ADD CONSTRAINT "board_collaborator_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element" ADD CONSTRAINT "element_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element" ADD CONSTRAINT "element_update_by_id_user_id_fk" FOREIGN KEY ("update_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;