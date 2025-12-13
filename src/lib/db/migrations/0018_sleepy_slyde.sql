CREATE TABLE "adoption_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adoption_id" uuid NOT NULL,
	"status" varchar(50) NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" RENAME TO "adoptions";--> statement-breakpoint
ALTER TABLE "adoptions" DROP CONSTRAINT "applications_listing_id_listings_id_fk";
--> statement-breakpoint
ALTER TABLE "adoptions" DROP CONSTRAINT "applications_seeker_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_application_id_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "adoption_status_history" ADD CONSTRAINT "adoption_status_history_adoption_id_adoptions_id_fk" FOREIGN KEY ("adoption_id") REFERENCES "public"."adoptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_status_history" ADD CONSTRAINT "adoption_status_history_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_seeker_id_users_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_application_id_adoptions_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."adoptions"("id") ON DELETE no action ON UPDATE no action;