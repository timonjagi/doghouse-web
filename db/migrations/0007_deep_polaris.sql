ALTER TABLE "wanted_listings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "wanted_listings" CASCADE;--> statement-breakpoint
ALTER TABLE "breeder_profiles" ALTER COLUMN "rating" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "preferred_breed_id" uuid;--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "preferred_breed" varchar(255);--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "preferred_age" varchar(50);--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "preferred_sex" varchar(50);--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "spay_neuter_preference" varchar(50);--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "activity_level" varchar(50);--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD CONSTRAINT "seeker_profiles_preferred_breed_id_breeds_id_fk" FOREIGN KEY ("preferred_breed_id") REFERENCES "public"."breeds"("id") ON DELETE no action ON UPDATE no action;