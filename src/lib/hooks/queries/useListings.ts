import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Listing } from '../../../../db/schema';

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
  parents?: any;
  health?: any;
  training?: any;
  requirements?: any;
  status?: 'pending' | 'available' | 'reserved' | 'sold' | 'completed';
  is_featured?: boolean;
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
  status?: 'pending' | 'available' | 'reserved' | 'sold' | 'completed';
  photos?: string[];
  location_text?: string;
  location_lat?: number;
  location_lng?: number;
  is_featured?: boolean;
  tags?: string[];
  parents?: any;
  health?: any;
  training?: any;
  requirements?: any;
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
    queryFn: async (): Promise<any> => {
      let query = supabase.from('listings').select(`
        id,
        title,
        description,
        type,
        owner_id,
        owner_type,
        breed_id,
        user_breed_id,
        birth_date,
        available_date,
        number_of_puppies,
        pet_name,
        pet_age,
        pet_gender,
        price,
        reservation_fee,
        status,
        photos,
        location_text,
        location_lat,
        location_lng,
        is_featured,
        view_count,
        tags,
        created_at,
        updated_at,
        breeds (
          name
        )
        `);
      console.log('Fetching listings with filters:', filters);
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
        .select(
          `
          id,
          title,
          description,
          type,
          breed_id,
          user_breed_id,
          owner_id,
          owner_type,
          birth_date,
          available_date,
          number_of_puppies,
          pet_name,
          pet_age,
          pet_gender,
          price,
          reservation_fee,
          parents,
          health,
          training,
          requirements,
          status,
          photos,
          location_text,
          location_lat,
          location_lng,
          is_featured,
          view_count,
          tags,
          created_at,
          updated_at,
          breeds (
            name
          ),
          users (
            display_name,
            profile_photo_url,
            breeder_profiles (
              kennel_name,
              kennel_location
            )
          )
        `
        )
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
    queryFn: async (): Promise<any> => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          type,
          breed_id,
          owner_id,
          user_breed_id,
          birth_date,
          available_date,
          number_of_puppies,
          pet_name,
          pet_age,
          pet_gender,
          price,
          reservation_fee,
          status,
          photos,
          created_at,
          updated_at,
          breeds (
            id, 
            name
          )
        `)
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

export const useListingsForBreed = (breedId: string) => {
  return useQuery({
    queryKey: queryKeys.listings.byBreed(breedId),
    queryFn: async (): Promise<Partial<Listing>[]> => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          type,
          price,
          reservation_fee,
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
// Query to get listings for a specific breed
export const useListingsForUserBreed = (userBreedId: string) => {
  return useQuery({
    queryKey: queryKeys.listings.byBreed(userBreedId),
    queryFn: async (): Promise<Partial<Listing>[]> => {

      if (!userBreedId) throw new Error('No user breed ID provided. Please provide a valid user');
      console.log('Fetching listings for user breed ID:', userBreedId);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          type,
          description,
          price,
          reservation_fee,
          birth_date,
          available_date,
          number_of_puppies,
          pet_name,
          pet_age,
          pet_gender,
          location_text,
          photos,
          status,
          created_at,
          users (
            display_name,
            profile_photo_url
          ),
          breeds (
            name
          )
        `)
        .eq('user_breed_id', userBreedId)
        .eq('status', 'available');

      if (error) throw error;
      return data || [];
    },
    enabled: !!userBreedId,
  });
};


// Mutation to create a new listing
export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: CreateListingData): Promise<Listing> => {
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
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateListingData }): Promise<Listing> => {
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
export const useUploadListingPhotos = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, files }: { listingId: string; files: File[] | string[] }) => {
      const uploadPromises = files.map(async (file) => {

        if (!listingId) throw new Error('Listing ID is required');

        if (file instanceof File) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${listingId}/${Date.now()}-${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(`user-${userId}/${fileName}`, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(`user-${userId}/${fileName}`);

          return publicUrl;
        }
      });

      const photoUrls = await Promise.all(uploadPromises);
      return photoUrls;
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(listingId) });
    },
  });
};

// Mutation to delete a listing
export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all() });
    },
  });
}