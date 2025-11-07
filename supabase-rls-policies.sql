-- =====================================================
-- Doghouse Platform - Row Level Security (RLS) Policies
-- =====================================================
-- Run this script in your Supabase SQL Editor to configure
-- proper data access controls for the Doghouse platform

-- Enable RLS on all core tables
-- =====================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "breeder_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "kennels" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_breeds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "litters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wanted_listings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
-- =====================================================

-- Policy: Users can view their own profile
CREATE POLICY "users_can_view_own_profile" ON "users"
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON "users"
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (for onboarding)
CREATE POLICY "users_can_insert_own_profile" ON "users"
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "admins_can_view_all_profiles" ON "users"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update any profile
CREATE POLICY "admins_can_update_all_profiles" ON "users"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Breeder Profiles Table Policies
-- =====================================================

-- Policy: Breeders can view their own breeder profile
CREATE POLICY "breeders_can_view_own_profile" ON "breeder_profiles"
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: Breeders can update their own breeder profile
CREATE POLICY "breeders_can_update_own_profile" ON "breeder_profiles"
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Breeders can insert their own breeder profile
CREATE POLICY "breeders_can_insert_own_profile" ON "breeder_profiles"
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Public can view verified breeder profiles
CREATE POLICY "public_can_view_verified_breeders" ON "breeder_profiles"
  FOR SELECT
  USING (verified_at IS NOT NULL);

-- Kennels Table Policies
-- =====================================================

-- Policy: Kennel owners can manage their kennels
CREATE POLICY "kennel_owners_can_manage_kennels" ON "kennels"
  FOR ALL
  USING (auth.uid() = user_id);

-- Policy: Public can view kennel information
CREATE POLICY "public_can_view_kennels" ON "kennels"
  FOR SELECT
  USING (true);

-- User Breeds Table Policies
-- =====================================================

-- Policy: Breeders can manage their own breed associations
CREATE POLICY "breeders_can_manage_user_breeds" ON "user_breeds"
  FOR ALL
  USING (auth.uid() = user_id);

-- Policy: Public can view breeder breed associations
CREATE POLICY "public_can_view_user_breeds" ON "user_breeds"
  FOR SELECT
  USING (true);

-- Litters Table Policies
-- =====================================================

-- Policy: Breeders can manage their own litters
CREATE POLICY "breeders_can_manage_own_litters" ON "litters"
  FOR ALL
  USING (auth.uid() = breeder_id);

-- Policy: Public can view available litters
CREATE POLICY "public_can_view_available_litters" ON "litters"
  FOR SELECT
  USING (status = 'available');

-- Policy: Authenticated users can view all litters (for seekers to browse)
CREATE POLICY "authenticated_can_view_all_litters" ON "litters"
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Applications Table Policies
-- =====================================================

-- Policy: Seekers can view their own applications
CREATE POLICY "seekers_can_view_own_applications" ON "applications"
  FOR SELECT
  USING (auth.uid() = seeker_id);

-- Policy: Seekers can create applications
CREATE POLICY "seekers_can_create_applications" ON "applications"
  FOR INSERT
  WITH CHECK (auth.uid() = seeker_id);

-- Policy: Breeders can view applications for their litters
CREATE POLICY "breeders_can_view_litter_applications" ON "applications"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "litters"
      WHERE litters.id = applications.litter_id
      AND litters.breeder_id = auth.uid()
    )
  );

-- Policy: Breeders can update applications for their litters
CREATE POLICY "breeders_can_update_litter_applications" ON "applications"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "litters"
      WHERE litters.id = applications.litter_id
      AND litters.breeder_id = auth.uid()
    )
  );

-- Policy: Admins can view all applications
CREATE POLICY "admins_can_view_all_applications" ON "applications"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- Wanted Listings Table Policies
-- =====================================================

-- Policy: Seekers can manage their own wanted listings
CREATE POLICY "seekers_can_manage_wanted_listings" ON "wanted_listings"
  FOR ALL
  USING (auth.uid() = seeker_id);

-- Policy: Public can view active wanted listings
CREATE POLICY "public_can_view_active_wanted_listings" ON "wanted_listings"
  FOR SELECT
  USING (is_active = true);

-- Messages Table Policies
-- =====================================================

-- Policy: Users can view messages they're part of
CREATE POLICY "users_can_view_own_messages" ON "messages"
  FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id
  );

-- Policy: Users can send messages
CREATE POLICY "users_can_send_messages" ON "messages"
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update messages they sent
CREATE POLICY "users_can_update_own_messages" ON "messages"
  FOR UPDATE
  USING (auth.uid() = sender_id);

-- Notifications Table Policies
-- =====================================================

-- Policy: Users can view their own notifications
CREATE POLICY "users_can_view_own_notifications" ON "notifications"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "users_can_update_own_notifications" ON "notifications"
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: System can create notifications for users
CREATE POLICY "system_can_create_notifications" ON "notifications"
  FOR INSERT
  WITH CHECK (true);

-- Activity Logs Table Policies
-- =====================================================

-- Policy: Users can view their own activity logs
CREATE POLICY "users_can_view_own_activity" ON "activity_logs"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Admins can view all activity logs
CREATE POLICY "admins_can_view_all_activity" ON "activity_logs"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: System can create activity logs
CREATE POLICY "system_can_create_activity_logs" ON "activity_logs"
  FOR INSERT
  WITH CHECK (true);

-- Transactions Table Policies
-- =====================================================

-- Policy: Seekers can view their own transactions
CREATE POLICY "seekers_can_view_own_transactions" ON "transactions"
  FOR SELECT
  USING (auth.uid() = seeker_id);

-- Policy: Breeders can view transactions for their sales
CREATE POLICY "breeders_can_view_own_transactions" ON "transactions"
  FOR SELECT
  USING (auth.uid() = breeder_id);

-- Policy: Admins can view all transactions
CREATE POLICY "admins_can_view_all_transactions" ON "transactions"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy: System can create transactions
CREATE POLICY "system_can_create_transactions" ON "transactions"
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
-- =====================================================

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_role ON "users" (role);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON "users" (is_verified);
CREATE INDEX IF NOT EXISTS idx_litters_status ON "litters" (status);
CREATE INDEX IF NOT EXISTS idx_litters_breeder_id ON "litters" (breeder_id);
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON "applications" (seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_litter_id ON "applications" (litter_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON "applications" (status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON "notifications" (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON "notifications" (is_read);

-- Create a function to check if user is admin
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "users"
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is breeder
-- =====================================================

CREATE OR REPLACE FUNCTION is_breeder(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "users"
    WHERE id = user_id AND role = 'breeder'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is seeker
-- =====================================================

CREATE OR REPLACE FUNCTION is_seeker(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "users"
    WHERE id = user_id AND role = 'seeker'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS SETUP COMPLETE
-- =====================================================
-- After running this script:
-- 1. All tables have RLS enabled
-- 2. Users can only access their own data
-- 3. Breeders can manage their litters and applications
-- 4. Public can view available litters and verified breeders
-- 5. Admins have access to all data for management
-- 6. Proper indexes are created for performance
-- 7. Helper functions are available for role checking
-- =====================================================
