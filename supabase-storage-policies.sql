-- =====================================================
-- Doghouse Platform - Storage Bucket Policies
-- =====================================================
-- Run this script in your Supabase SQL Editor to configure
-- proper storage access controls for the Doghouse platform

-- Create breed-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'breed-images',
  'breed-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage Policies for breed-images bucket
-- =====================================================

-- Policy: Authenticated users can upload images to their own folder
CREATE POLICY "authenticated_users_can_upload_to_own_folder" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'breed-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );

-- Policy: Users can view images in their own folder
CREATE POLICY "users_can_view_own_images" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'breed-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );

-- Policy: Users can update images in their own folder
CREATE POLICY "users_can_update_own_images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'breed-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );

-- Policy: Users can delete images from their own folder
CREATE POLICY "users_can_delete_own_images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'breed-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'user-' || auth.uid()::text
  );

-- Policy: Public can view breed images (for displaying in the app)
CREATE POLICY "public_can_view_breed_images" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'breed-images'
    AND name LIKE 'user-%/%'
  );

-- Policy: Admins can manage all images
CREATE POLICY "admins_can_manage_all_images" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'breed-images'
    AND EXISTS (
      SELECT 1 FROM "users"
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better storage performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name ON storage.objects (bucket_id, name);
CREATE INDEX IF NOT EXISTS idx_storage_objects_user_folder ON storage.objects (
  bucket_id,
  (storage.foldername(name))[1]
) WHERE bucket_id = 'breed-images';

-- Create helper function to check if user owns the storage object
-- =====================================================

CREATE OR REPLACE FUNCTION user_owns_storage_object(object_name text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT (storage.foldername(object_name))[1] = 'user-' || auth.uid()::text
    FROM storage.objects
    WHERE name = object_name
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE POLICIES SETUP COMPLETE
-- =====================================================
-- After running this script:
-- 1. Storage bucket 'breed-images' is created with proper configuration
-- 2. Authenticated users can only upload to their own user folder
-- 3. Users can manage (view, update, delete) files in their own folder
-- 4. Public can view breed images for display purposes
-- 5. Admins have full access to all storage objects
-- 6. Proper indexes are created for performance
-- 7. Helper function is available for ownership checking
-- =====================================================
