import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { useAppStore } from '../../stores/useAppStore';
import { User } from '../../../../db/schema';

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
  return useQuery({
    queryKey: queryKeys.users.currentProfile(),
    queryFn: async (): Promise<User | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
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

  return useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      const { data: { user } } = await supabase.auth.getUser();

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
      // Update the user session in Zustand store
      const { updateUserProfile } = useAppStore.getState();
      updateUserProfile({
        displayName: data.display_name,
        avatarUrl: data.profile_photo_url,
      });

      // Invalidate relevant queries - avoid infinite recursion
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
    },
  });
};

// Mutation to upload profile photo
export const useUploadProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const { data: { user } } = await supabase.auth.getUser();
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
      // Update the user session in Zustand store
      const { updateUserProfile } = useAppStore.getState();
      updateUserProfile({ avatarUrl });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.currentProfile() });
    },
  });
};
