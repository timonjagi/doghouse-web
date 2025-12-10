-- Rename table
ALTER TABLE applications RENAME TO adoptions;

-- Rename foreign key column in transactions (optional but recommended for consistency, though verify with user first. The prompt said "update the schemas well")
-- ALTER TABLE transactions RENAME COLUMN application_id TO adoption_id;

-- I will stick to just renaming the table first as it's the primary request and less likely to break FK constraints unless cascade is set or checking is on. 
-- Actually, renaming a table usually preserves FKs in Postgres.
-- However, the schema definition for 'transactions' refers to 'applications.id'. I will need to update schema.ts for that.
