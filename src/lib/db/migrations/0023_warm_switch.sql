CREATE TABLE "breeder_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"breeder_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "breeder_subscriptions" ADD CONSTRAINT "breeder_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeder_subscriptions" ADD CONSTRAINT "breeder_subscriptions_breeder_id_users_id_fk" FOREIGN KEY ("breeder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;