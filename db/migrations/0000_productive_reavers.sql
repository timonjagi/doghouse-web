CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(255) NOT NULL,
	"description" text,
	"context" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"litter_id" uuid,
	"seeker_id" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'submitted' NOT NULL,
	"application_data" jsonb,
	"contract_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "breeder_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kennel_name" varchar(255),
	"kennel_location" varchar(255),
	"verification_docs" jsonb,
	"verified_at" timestamp,
	"rating" numeric(3, 2) DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "breeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"group" varchar(100),
	"size" varchar(50),
	"description" text,
	"traits" jsonb,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kennels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255),
	"location_lat" numeric(9, 6),
	"location_lng" numeric(9, 6),
	"photos" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "litters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"breeder_id" uuid NOT NULL,
	"user_breed_id" uuid,
	"name" varchar(255),
	"birth_date" timestamp,
	"available_date" timestamp,
	"number_of_puppies" integer,
	"reservation_fee" numeric(10, 2),
	"status" varchar(50) DEFAULT 'available' NOT NULL,
	"photos" jsonb,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid,
	"sender_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"content" text,
	"attachments" jsonb,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"title" varchar(255),
	"body" text,
	"target_type" varchar(100),
	"target_id" uuid,
	"is_read" boolean DEFAULT false NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"seeker_id" uuid NOT NULL,
	"breeder_id" uuid NOT NULL,
	"amount" numeric(10, 2),
	"commission_fee" numeric(10, 2),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"payment_method" varchar(100),
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_breeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"breed_id" uuid NOT NULL,
	"is_owner" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(32),
	"display_name" varchar(200),
	"role" varchar(32) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"profile_photo_url" text,
	"bio" text,
	"location_text" varchar(255),
	"location_lat" numeric(9, 6),
	"location_lng" numeric(9, 6),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wanted_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seeker_id" uuid NOT NULL,
	"pet_type" varchar(50) NOT NULL,
	"preferred_breed" varchar(255),
	"experience_level" varchar(50),
	"living_situation" text,
	"notes" text,
	"location_lat" numeric(9, 6),
	"location_lng" numeric(9, 6),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_litter_id_litters_id_fk" FOREIGN KEY ("litter_id") REFERENCES "public"."litters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_seeker_id_users_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "breeder_profiles" ADD CONSTRAINT "breeder_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kennels" ADD CONSTRAINT "kennels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "litters" ADD CONSTRAINT "litters_breeder_id_users_id_fk" FOREIGN KEY ("breeder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "litters" ADD CONSTRAINT "litters_user_breed_id_user_breeds_id_fk" FOREIGN KEY ("user_breed_id") REFERENCES "public"."user_breeds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_seeker_id_users_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_breeder_id_users_id_fk" FOREIGN KEY ("breeder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_breeds" ADD CONSTRAINT "user_breeds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_breeds" ADD CONSTRAINT "user_breeds_breed_id_breeds_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wanted_listings" ADD CONSTRAINT "wanted_listings_seeker_id_users_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;