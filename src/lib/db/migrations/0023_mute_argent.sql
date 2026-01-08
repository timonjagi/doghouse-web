ALTER TABLE "breeder_profiles" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "flagged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "flagged_reason" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "flagged_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_sign_in_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_confirmed_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;