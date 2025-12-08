ALTER TABLE "user_breeds" ADD COLUMN "images" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "living_situation" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "experience_level" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kennel_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kennel_location" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "facility_type" varchar(100);--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "preferred_age" varchar(50);--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "preferred_sex" varchar(50);--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "spay_neuter_preference" varchar(50);--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "activity_level" varchar(50);--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "has_allergies" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "has_children" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD COLUMN "has_other_pets" boolean DEFAULT false;