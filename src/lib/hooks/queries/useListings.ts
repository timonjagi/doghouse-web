import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';

// Types
interface Listing {
  id: string;
  title: string;
  description?: string;
  type: 'litter' | 'single_pet' | 'wanted';
  owner_id: string;
  owner_type: 'breeder' | 'seeker';
  breed_id?: string;
  user_breed_id?: string;
  birth_date?: string;
  available_date?: string;
  number_of_puppies?: number;
  pet_name?: string;
  pet_age?: string;
  pet_gender?: string;
  price?: number;
  reservation_fee?: number;
  status: 'available' | 'reserved' | 'sold' | 'completed';
  photos?: string[];
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  is_featured: boolean;
  view_count: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface CreateListingData {
  title: string;
  description?: string;
  type: 'litter' | 'single_pet' | 'wanted';
  breed_id?: string;
  user_breed_id?: string;
  birth_date?: string;
  available_date?: string;
  number_of_puppies?: number;
  pet_name?: string;
  pet_age?: string;
  pet_gender?: string;
  price?: number;
  reservation_fee?: number;
  photos?: string[];
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  tags?: string[];
}

interface UpdateListingData {
  title?: string;
  description?: string;
  type?: 'litter' | 'single_pet' | 'wanted';
  breed_id?: string;
  user_breed_id?: string;
  birth_date?: string;
  available_date?: string;
  number_of_puppies?: number;
  pet_name?: string;
  pet_age?: string;
  pet_gender?: string;
  price?: number;
  reservation_fee?: number;
  status?: 'available' | 'reserved' | 'sold' | 'completed';
  photos?: string[];
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  is_featured?: boolean;
  tags?: string[];
}

// Query to get all listings with optional filters
export const useListings = (filters?: {
  type?: string;
  status?: string;
  owner_id?: string;
  breed_id?: string;
  owner_type?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.listings.list(filters),
    queryFn: async (): Promise<Listing[]> => {
      let query = supabase.from('listings').select('*');

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }
      if (filters?.breed_id) {
        query = query.eq('breed_id', filters.breed_id);
      }
      if (filters?.owner_type) {
        query = query.eq('owner_type', filters.owner_type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

// Query to get listing by ID
export const useListing = (id: string) => {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn: async (): Promise<Listing | null> => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Query to get listings by owner
export const useListingsByOwner = (ownerId: string) => {
  return useQuery({
    queryKey: queryKeys.listings.byOwner(ownerId),
    queryFn: async (): Promise<Listing[]> => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!ownerId,
  });
};

// Query to get featured listings
export const useFeaturedListings = () => {
  return useQuery({
    queryKey: queryKeys.listings.featured(),
    queryFn: async (): Promise<Listing[]> => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
};

// Query to get listings for a specific breed
export const useListingsForBreed = (breedId: string) => {
  return useQuery({
    queryKey: queryKeys.listings.byBreed(breedId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          price,
          location_text,
          photos,
          status,
          created_at,
          users (
            display_name,
            profile_photo_url
          )
        `)
        .eq('breed_id', breedId)
        .eq('status', 'available');

      if (error) throw error;
      return data || [];
    },
    enabled: !!breedId,
  });
};


// Mutation to create a new listing
export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: CreateListingData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all() });
    },
  });
};

// Mutation to update a listing
export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateListingData }) => {
      const { data, error } = await supabase
        .from('listings')
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
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all() });
    },
  });
};

// Mutation to increment view count
export const useIncrementListingViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      // First get current view count
      const { data: currentListing, error: fetchError } = await supabase
        .from('listings')
        .select('view_count')
        .eq('id', listingId)
        .single();

      if (fetchError) throw fetchError;

      // Update with incremented count
      const { error } = await supabase
        .from('listings')
        .update({
          view_count: (currentListing.view_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', listingId);

      if (error) throw error;
    },
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(listingId) });
    },
  });
};

// Mutation to upload listing photos
export const useUploadListingPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, files }: { listingId: string; files: File[] }) => {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${listingId}/${Date.now()}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listing-photos')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const photoUrls = await Promise.all(uploadPromises);

      // Update listing with new photo URLs
      const { data: listing, error } = await supabase
        .from('listings')
        .select('photos')
        .eq('id', listingId)
        .single();

      if (error) throw error;

      const updatedPhotos = [...(listing.photos || []), ...photoUrls];

      const { error: updateError } = await supabase
        .from('listings')
        .update({ photos: updatedPhotos })
        .eq('id', listingId);

      if (updateError) throw updateError;

      return updatedPhotos;
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(listingId) });
    },
  });
};
