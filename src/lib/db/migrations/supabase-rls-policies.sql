-- =====================================================
-- Pethouse Platform - Row Level Security (RLS) Policies
-- Updated for Unified Schema
-- =====================================================
-- Run this script in your Supabase SQL Editor to configure
-- proper data access controls for the Pethouse platform
--
-- IMPORTANT: This script will DROP existing policies before
-- creating new ones to avoid conflicts.
-- =====================================================

-- =====================================================
-- DROP EXISTING POLICIES (if any)
-- =====================================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- Enable RLS on all tables
-- =====================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "breeds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seeker_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "breeder_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "kennels" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_breeds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "listings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wishlists" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS Table Policies
-- =====================================================

-- Public can view basic user info (for displaying breeder/owner info on listings)
CREATE POLICY "public_can_view_users" ON "users"
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON "users"
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for onboarding)
CREATE POLICY "users_can_insert_own_profile" ON "users"
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- BREEDS Table Policies (Reference data - public read)
-- =====================================================

-- Public can view all breeds
CREATE POLICY "public_can_view_breeds" ON "breeds"
  FOR SELECT
  USING (true);

-- Only admins can modify breeds (via service role or admin check)
CREATE POLICY "admins_can_manage_breeds" ON "breeds"
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- SEEKER_PROFILES Table Policies
-- =====================================================

-- Users can view their own seeker profile
CREATE POLICY "users_can_view_own_seeker_profile" ON "seeker_profiles"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own seeker profile
CREATE POLICY "users_can_manage_own_seeker_profile" ON "seeker_profiles"
  FOR ALL
  USING (auth.uid() = user_id);

-- Admins can view all seeker profiles
CREATE POLICY "admins_can_view_all_seeker_profiles" ON "seeker_profiles"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- BREEDER_PROFILES Table Policies
-- =====================================================

-- Public can view breeder profiles (for browsing breeders)
CREATE POLICY "public_can_view_breeder_profiles" ON "breeder_profiles"
  FOR SELECT
  USING (true);

-- Breeders can manage their own profile
CREATE POLICY "breeders_can_manage_own_profile" ON "breeder_profiles"
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- KENNELS Table Policies
-- =====================================================

-- Public can view kennels
CREATE POLICY "public_can_view_kennels" ON "kennels"
  FOR SELECT
  USING (true);

-- Kennel owners can manage their kennels (via breeder_profile)
CREATE POLICY "owners_can_manage_kennels" ON "kennels"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "breeder_profiles"
      WHERE breeder_profiles.id = kennels.breeder_profile_id
      AND breeder_profiles.user_id = auth.uid()
    )
  );

-- =====================================================
-- USER_BREEDS Table Policies
-- =====================================================

-- Public can view user breeds (for browsing available breeds)
CREATE POLICY "public_can_view_user_breeds" ON "user_breeds"
  FOR SELECT
  USING (true);

-- Users can manage their own breed associations
CREATE POLICY "users_can_manage_own_user_breeds" ON "user_breeds"
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- LISTINGS Table Policies (Unified table)
-- =====================================================

-- Public can view all listings
CREATE POLICY "public_can_view_listings" ON "listings"
  FOR SELECT
  USING (true);

-- Owners can manage their own listings
CREATE POLICY "owners_can_manage_own_listings" ON "listings"
  FOR ALL
  USING (auth.uid() = owner_id);

-- =====================================================
-- APPLICATIONS Table Policies
-- =====================================================

-- Seekers can view their own applications
CREATE POLICY "seekers_can_view_own_applications" ON "applications"
  FOR SELECT
  USING (auth.uid() = seeker_id);

-- Seekers can create applications
CREATE POLICY "seekers_can_create_applications" ON "applications"
  FOR INSERT
  WITH CHECK (auth.uid() = seeker_id);

-- Seekers can update their own applications
CREATE POLICY "seekers_can_update_own_applications" ON "applications"
  FOR UPDATE
  USING (auth.uid() = seeker_id);

-- Listing owners can view applications for their listings
CREATE POLICY "owners_can_view_listing_applications" ON "applications"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "listings"
      WHERE listings.id = applications.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

-- Listing owners can update applications for their listings
CREATE POLICY "owners_can_update_listing_applications" ON "applications"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "listings"
      WHERE listings.id = applications.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

-- Admins can view all applications
CREATE POLICY "admins_can_view_all_applications" ON "applications"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- MESSAGES Table Policies
-- =====================================================

-- Users can view messages they're part of
CREATE POLICY "users_can_view_own_messages" ON "messages"
  FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id
  );

-- Users can send messages
CREATE POLICY "users_can_send_messages" ON "messages"
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they sent or received (for marking read)
CREATE POLICY "users_can_update_own_messages" ON "messages"
  FOR UPDATE
  USING (
    auth.uid() = sender_id OR
    auth.uid() = recipient_id
  );

-- =====================================================
-- NOTIFICATIONS Table Policies
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "users_can_view_own_notifications" ON "notifications"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "users_can_update_own_notifications" ON "notifications"
  FOR UPDATE
  USING (auth.uid() = user_id);

-- System/authenticated can create notifications
CREATE POLICY "authenticated_can_create_notifications" ON "notifications"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- ACTIVITY_LOGS Table Policies
-- =====================================================

-- Users can view their own activity logs
CREATE POLICY "users_can_view_own_activity" ON "activity_logs"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all activity logs
CREATE POLICY "admins_can_view_all_activity" ON "activity_logs"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- System/authenticated can create activity logs
CREATE POLICY "authenticated_can_create_activity_logs" ON "activity_logs"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- WISHLISTS Table Policies
-- =====================================================

-- Users can view their own wishlists
CREATE POLICY "users_can_view_own_wishlists" ON "wishlists"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own wishlists
CREATE POLICY "users_can_manage_own_wishlists" ON "wishlists"
  FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- TRANSACTIONS Table Policies
-- =====================================================

-- Seekers can view their own transactions
CREATE POLICY "seekers_can_view_own_transactions" ON "transactions"
  FOR SELECT
  USING (auth.uid() = seeker_id);

-- Breeders can view transactions for their sales
CREATE POLICY "breeders_can_view_own_transactions" ON "transactions"
  FOR SELECT
  USING (auth.uid() = breeder_id);

-- Admins can view all transactions
CREATE POLICY "admins_can_view_all_transactions" ON "transactions"
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = 'admin')
  );

-- System/authenticated can create transactions
CREATE POLICY "authenticated_can_create_transactions" ON "transactions"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- Performance Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON "users" (role);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON "users" (is_verified);
CREATE INDEX IF NOT EXISTS idx_listings_status ON "listings" (status);
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON "listings" (owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_breed_id ON "listings" (breed_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON "listings" (type);
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON "applications" (seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_listing_id ON "applications" (listing_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON "applications" (status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON "notifications" (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON "notifications" (is_read);
CREATE INDEX IF NOT EXISTS idx_user_breeds_user_id ON "user_breeds" (user_id);
CREATE INDEX IF NOT EXISTS idx_user_breeds_breed_id ON "user_breeds" (breed_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON "wishlists" (user_id);
CREATE INDEX IF NOT EXISTS idx_breeder_profiles_user_id ON "breeder_profiles" (user_id);
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_user_id ON "seeker_profiles" (user_id);

-- =====================================================
-- Helper Functions
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

CREATE OR REPLACE FUNCTION is_breeder(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "users"
    WHERE id = user_id AND role = 'breeder'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
-- Tables with PUBLIC READ access:
--   - users, breeds, breeder_profiles, kennels, user_breeds, listings
--
-- Tables with OWNER-ONLY access:
--   - seeker_profiles, applications, messages, notifications,
--     activity_logs, wishlists, transactions
--
-- All tables allow owners to manage their own data.
-- Admins have access to all data for management.
-- =====================================================
