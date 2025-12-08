ALTER TABLE "litters" RENAME TO "listings";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "litter_id" TO "listing_id";--> statement-breakpoint
ALTER TABLE "listings" RENAME COLUMN "breeder_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_litter_id_litters_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" DROP CONSTRAINT "litters_breeder_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" DROP CONSTRAINT "litters_user_breed_id_user_breeds_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "owner_type" varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "breed_id" uuid;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "pet_name" varchar(255);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "pet_age" varchar(50);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "pet_gender" varchar(20);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "location_text" varchar(255);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "location_lat" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "location_lng" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "tags" jsonb;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_breed_id_breeds_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_breed_id_user_breeds_id_fk" FOREIGN KEY ("user_breed_id") REFERENCES "public"."user_breeds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "name";