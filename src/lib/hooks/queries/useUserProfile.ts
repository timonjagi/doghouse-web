import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { User } from '../../db/schema';
import { useCurrentUser } from './useAuth';

interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  phone?: string;
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  profile_photo_url?: string | null;
  role?: string;
  onboarding_completed?: boolean;
}

// Query to get current user profile from database
export const useUserProfile = () => {
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.users.currentProfile(user?.id),
    queryFn: async (): Promise<User | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Query to get user profile by ID
export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: async (): Promise<User | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

// Mutation to update user profile in database
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries - avoid infinite recursion
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.currentProfile(user?.id) });
    },
  });
};

// Mutation to upload profile photo
export const useUploadProfilePhoto = () => {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!user) throw new Error('No authenticated user');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(`user-${user.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(`user-${user.id}/${fileName}`);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: (avatarUrl) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.currentProfile(user?.id) });
    },
  });
};
