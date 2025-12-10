-- Rename table
ALTER TABLE applications RENAME TO adoptions;

-- Create adoption_status_history table
CREATE TABLE IF NOT EXISTS "adoption_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adoption_id" uuid NOT NULL REFERENCES "adoptions"("id"),
	"status" varchar(50) NOT NULL,
	"notes" text,
	"created_by" uuid REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Note: 'transactions' table still has 'application_id' column which now points to 'adoptions' table based on FK constraints usually moving with table rename, but IF strict constraints were named specifically, might need checking. Drizzle usually handles logic, but raw SQL here assumes standard Postgres behavior where RENAME TABLE preserves relation integrity but keeps old column names if not changed.
