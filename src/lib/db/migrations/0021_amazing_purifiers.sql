ALTER TABLE "breeder_profiles" RENAME COLUMN "pet_type" TO "pet_types";--> statement-breakpoint
ALTER TABLE "breeds" ADD COLUMN "pet_type" varchar(50) DEFAULT 'dog';--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "pet_type" varchar(50);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "secondary_breed_id" uuid;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "is_cross_breed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_breeds" ADD COLUMN "pet_type" varchar(50);--> statement-breakpoint
ALTER TABLE "user_breeds" ADD COLUMN "is_cross_breed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_breeds" ADD COLUMN "secondary_breed_id" uuid;--> statement-breakpoint
ALTER TABLE "user_breeds" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_secondary_breed_id_breeds_id_fk" FOREIGN KEY ("secondary_breed_id") REFERENCES "public"."breeds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_breeds" ADD CONSTRAINT "user_breeds_secondary_breed_id_breeds_id_fk" FOREIGN KEY ("secondary_breed_id") REFERENCES "public"."breeds"("id") ON DELETE no action ON UPDATE no action;