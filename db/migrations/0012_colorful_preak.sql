ALTER TABLE "messages" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;