CREATE TABLE "seeker_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"living_situation" text,
	"experience_level" varchar(50),
	"has_allergies" boolean DEFAULT false,
	"has_children" boolean DEFAULT false,
	"has_other_pets" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "kennels" RENAME COLUMN "user_id" TO "breeder_profile_id";--> statement-breakpoint
ALTER TABLE "kennels" DROP CONSTRAINT "kennels_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "breeder_profiles" ADD COLUMN "facility_type" varchar(100);--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD CONSTRAINT "seeker_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kennels" ADD CONSTRAINT "kennels_breeder_profile_id_breeder_profiles_id_fk" FOREIGN KEY ("breeder_profile_id") REFERENCES "public"."breeder_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "living_situation";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "experience_level";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "kennel_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "kennel_location";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "facility_type";