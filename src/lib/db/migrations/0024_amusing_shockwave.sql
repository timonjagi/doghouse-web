ALTER TABLE "breeder_subscriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "breeder_subscriptions" CASCADE;--> statement-breakpoint
ALTER TABLE "wishlists" ADD COLUMN "breeder_id" uuid;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_breeder_id_users_id_fk" FOREIGN KEY ("breeder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;