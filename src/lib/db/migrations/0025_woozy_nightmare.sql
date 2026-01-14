CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adoption_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"breeder_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"comment" text,
	"aspects" jsonb,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"helpful_votes" integer DEFAULT 0,
	"flagged" boolean DEFAULT false NOT NULL,
	"flag_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"view_count" integer DEFAULT 0,
	"helpful_votes" integer DEFAULT 0,
	"not_helpful_votes" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_ticket_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100),
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_ticket_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category_id" uuid,
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"assigned_to" uuid,
	"resolution" text,
	"tags" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"last_reply_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_role" varchar(100),
	"author_location" varchar(255),
	"author_avatar_url" text,
	"content" text NOT NULL,
	"rating" integer,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN IF NOT EXISTS "flagged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN IF NOT EXISTS "flag_reason" text;--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN IF NOT EXISTS "flagged_at" timestamp;--> statement-breakpoint
ALTER TABLE "adoptions" ADD COLUMN IF NOT EXISTS "admin_notes" text;--> statement-breakpoint
ALTER TABLE "breeder_profiles" ADD COLUMN IF NOT EXISTS "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "flagged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "flagged_reason" text;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "flagged_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_sign_in_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_confirmed_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_adoption_id_adoptions_id_fk" FOREIGN KEY ("adoption_id") REFERENCES "public"."adoptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_breeder_id_users_id_fk" FOREIGN KEY ("breeder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_faqs" ADD CONSTRAINT "support_faqs_category_id_support_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."support_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_faqs" ADD CONSTRAINT "support_faqs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ticket_attachments" ADD CONSTRAINT "support_ticket_attachments_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ticket_attachments" ADD CONSTRAINT "support_ticket_attachments_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ticket_comments" ADD CONSTRAINT "support_ticket_comments_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ticket_comments" ADD CONSTRAINT "support_ticket_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_category_id_support_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."support_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;