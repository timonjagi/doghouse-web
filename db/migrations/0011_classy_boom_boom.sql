ALTER TABLE "applications" ADD COLUMN "reservation_paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "contract_signed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "payment_complete" boolean DEFAULT false NOT NULL;