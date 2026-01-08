ALTER TABLE "adoptions" ADD COLUMN "flagged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN "flag_reason" text;--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN "flagged_at" timestamp;--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN "admin_notes" text;