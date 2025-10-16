# Storage Bucket Security Policies

This document explains the storage bucket policies implemented for the Doghouse platform.

## Overview

The storage bucket policies ensure that:
- Authenticated users can only upload images to their own user folder
- Users can manage (view, update, delete) files in their own folder
- Public can view breed images for display purposes
- Admins have full access to all storage objects

## Bucket Configuration

- **Bucket Name**: `breed-images`
- **Public Access**: Enabled (for displaying images in the app)
- **File Size Limit**: 10MB per file
- **Allowed MIME Types**: JPEG, PNG, WebP, GIF images only

## File Organization

Files are organized in the following structure:
```
breed-images/
├── user-{userId}/
│   ├── breed-{userId}-{timestamp}-{random}.{extension}
│   └── ...
└── ...
```

## Security Policies

### 1. Upload Policy (`authenticated_users_can_upload_to_own_folder`)
- **Operation**: INSERT
- **Scope**: Authenticated users only
- **Restriction**: Users can only upload to `user-{their-user-id}/` folder
- **Purpose**: Prevents users from uploading to other users' folders

### 2. User Management Policies
- **View Policy** (`users_can_view_own_images`): Users can view files in their own folder
- **Update Policy** (`users_can_update_own_images`): Users can update files in their own folder
- **Delete Policy** (`users_can_delete_own_images`): Users can delete files from their own folder

### 3. Public Access Policy (`public_can_view_breed_images`)
- **Operation**: SELECT
- **Scope**: Public (unauthenticated users)
- **Purpose**: Allows the app to display breed images to all visitors

### 4. Admin Policy (`admins_can_manage_all_images`)
- **Operation**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Scope**: Admin users only
- **Purpose**: Allows administrators to manage all storage objects

## Helper Function

A helper function `user_owns_storage_object(object_name)` is provided to check if a user owns a specific storage object. This can be used in application logic for additional security checks.

## Implementation Steps

1. **Run the SQL Script**: Execute `supabase-storage-policies.sql` in your Supabase SQL Editor
2. **Verify Bucket Creation**: Check that the `breed-images` bucket was created successfully
3. **Test Upload**: Test that authenticated users can upload to their own folder
4. **Test Access Control**: Verify that users cannot access other users' folders

## Integration with Application Code

The existing `useBreedImageUpload` hook already follows the correct pattern by uploading files to `user-${userId}/` paths. No changes to the application code are required - the security policies will automatically enforce the access controls.

## Monitoring and Maintenance

- Monitor storage usage and access patterns in Supabase Dashboard
- Regularly review and update allowed MIME types if needed
- Consider implementing file retention policies for old images
- Monitor for any unauthorized access attempts in Supabase logs
