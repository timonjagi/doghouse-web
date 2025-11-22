import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { UserBreed } from '../../../../db/schema';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';

interface CreateUserBreedData {
  breed_id: string;
  is_owner?: boolean;
  notes?: string;
  images?: string[];
}

interface UpdateUserBreedData {
  is_owner?: boolean;
  notes?: string;
  images?: string[];
}

// Query to get user's breeds with full breed details
export const useUserBreedsFromUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.breeds.userBreeds(userId),
    queryFn: async (): Promise<any[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          breed_id,
          is_owner,
          notes,
          images,
          created_at,
          updated_at,
          breeds (
            id,
            name,
            description,
            group,
            featured_image_url,
            height,
            weight,
            life_span,
            traits
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      console.log(error)
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get specific user breed by ID
export const useUserBreed = (breedId: string) => {
  return useQuery({
    queryKey: ['breeds', 'user-breed', breedId] as const,
    queryFn: async (): Promise<any> => {
      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          breed_id,
          is_owner,
          notes,
          images,
          created_at,
          updated_at,
          breeds (
            id,
            name,
            description,
            group,
            featured_image_url,
            height,
            weight,
            life_span,
            traits
          )
        `)
        .eq('id', breedId)
        .single();

      if (error) throw error;

      return data || null;
    },

    enabled: !!breedId,
  });
};

export const useAllAvailableUserBreeds = () => {
  return useQuery({
    queryKey: queryKeys.breeds.available(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          breed_id,
          is_owner,
          notes,
          images,
          created_at,
          updated_at,
          breeds (
            id,
            name,
            description,
            group,
            featured_image_url,
            height,
            weight,
            life_span,
            traits
          ),
          users (
            id,
            profile_photo_url,
            display_name,
            breeder_profiles (
              id,
              user_id,
              kennel_name,
              kennel_location,
              rating
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Deduplicate by breed_id and return unique breeds
      const uniqueBreeds = data?.reduce((acc, userBreed) => {
        if (userBreed.breeds && !acc.some(item => item.breed_id === userBreed.breed_id)) {
          acc.push({
            ...userBreed,
            // Include aggregated data from all breeders offering this breed
            breeder_count: data.filter(item => item.breed_id === userBreed.breed_id).length,
            // Use the most recent images from any breeder
            all_images: data
              .filter(item => item.breed_id === userBreed.breed_id && item.images)
              .flatMap(item => item.images || [])
          });
        }
        return acc;
      }, [] as any[]) || [];

      return uniqueBreeds;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes - available breeds don't change often
  });
};


// Query to get breeders offering a specific breed
export const useBreedersForBreed = (breedId: string) => {
  return useQuery({
    queryKey: queryKeys.breeds.breedBreeders(breedId),
    queryFn: async (): Promise<any[]> => {

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('user_breeds')
        .select(`
          id,
          user_id,
          notes,
          images,
          created_at,
          users(
            id,
            profile_photo_url,
            display_name,
            breeder_profiles(
              id,
              user_id,
              kennel_name,
              kennel_location,
              rating
            )
          )
        `)
        .eq('breed_id', breedId)
        .eq('is_owner', true);

      if (error) throw error;

      if (user && user?.user_metadata?.role === 'breeder') {
        return data?.filter(item => item.user_id !== user.id) || [];
      }
      return data || [];
    },
    enabled: !!breedId,
  });
};

// Mutation to create a new user breed association
export const useCreateUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserBreedData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: result, error } = await supabase
        .from('user_breeds')
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
    },
  });
};

// Mutation to update user breed
export const useUpdateUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateUserBreedData }) => {
      const { data, error } = await supabase
        .from('user_breeds')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
      queryClient.invalidateQueries({ queryKey: ['breeds', 'user-breed', data.id] as const });
    },
  });
};

// Mutation to delete user breed association
export const useDeleteUserBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breedId: string) => {
      const { error } = await supabase
        .from('user_breeds')
        .delete()
        .eq('id', breedId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.breeds.userBreeds() });
    },
  });
};

interface UseBreedImageUploadProps {
  userId: string;
  breedId?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export const useBreedImageUpload = ({
  userId,
  breedId,
  onUploadComplete
}: UseBreedImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const uploadImages = async (images: File[]): Promise<string[]> => {
    if (!userId || images.length === 0) return [];

    setUploading(true);
    setProgress(0);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `breed-${breedId}-${Date.now()}-${Math.random()}.${image.name.split('.').pop()}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('breed-images')
          .upload(`user-${userId}/${fileName}`, image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('breed-images')
          .getPublicUrl(`user-${userId}/${fileName}`);

        uploadedUrls.push(publicUrl);

        // Update progress
        setProgress(((i + 1) / images.length) * 100);
      }

      // Call completion callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }

      toast({
        title: "Images uploaded successfully!",
        description: `${uploadedUrls.length} breed image${uploadedUrls.length > 1 ? 's' : ''} uploaded.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setUploading(false);
    setProgress(0);
    return uploadedUrls;
  };

  const updateUserBreedWithImages = async (breedId: string, imageUrls: string[]) => {
    try {
      const { error } = await supabase
        .from('user_breeds')
        .update({
          images: imageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', breedId);

      if (error) throw error;

      toast({
        title: "Breed updated with images",
        description: "Your breed profile now includes the uploaded images.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error: any) {
      toast({
        title: "Failed to update breed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return {
    uploadImages,
    updateUserBreedWithImages,
    uploading,
    progress,
  };
};
