-- Add missing admin fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_sign_in_at timestamp;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_confirmed_at timestamp;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add verified boolean to breeder_profiles table (in addition to verified_at)
ALTER TABLE breeder_profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- Update existing verified_at records to set verified = true
UPDATE breeder_profiles SET verified = true WHERE verified_at IS NOT NULL;

-- Add flagged fields to listings table if they don't exist
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flagged_reason text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS flagged_at timestamp;
