ALTER TABLE "listings" DROP CONSTRAINT "listings_secondary_breed_id_breeds_id_fk";
--> statement-breakpoint
ALTER TABLE "user_breeds" DROP CONSTRAINT "user_breeds_secondary_breed_id_breeds_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "secondary_breed_id";--> statement-breakpoint
ALTER TABLE "listings" DROP COLUMN "is_cross_breed";--> statement-breakpoint
ALTER TABLE "user_breeds" DROP COLUMN "is_cross_breed";--> statement-breakpoint
ALTER TABLE "user_breeds" DROP COLUMN "secondary_breed_id";