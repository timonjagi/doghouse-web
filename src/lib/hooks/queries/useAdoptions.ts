import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Adoption } from '../../db/schema';

// Extended Adoption type with related data
export interface AdoptionWithListing extends Adoption {
  listings: {
    id: string;
    title: string;
    type: string;
    price: number | null;
    reservation_fee: number | null;
    photos: string[];
    owner_id: string;
    birth_date: string | null;
    available_date: string | null;
    number_of_puppies: number | null;
    pet_name: string | null;
    pet_age: string | null;
    pet_gender: string | null;
    location_text: string | null;
    location_lat: number | null;
    location_lng: number | null;
    requirements: any;
    breeds: {
      id: string;
      name: string;
    };
    users?: {
      id: string;
      display_name: string;
      email: string;
      profile_photo_url: string | null;
      location_text: string | null;
    };
  };
  users: {
    id: string;
    display_name: string;
    email: string;
    profile_photo_url: string | null;
    location_text: string | null;
    created_at: string;
    phone: string | null;
    seeker_profiles?: {
      id: string;
      experience_level: string | null;
      living_situation: string | null;
      has_other_pets: boolean | null;
    } | null;
  };
}


interface UpdateAdoptionData {
  status?: string;
  reservation_paid?: boolean;
  contract_signed?: boolean;
  payment_completed?: boolean;
  application_data?: any
}
// Query to get adoptions for a specific listing
export const useAdoptionsByListing = (listingId: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.byListing(listingId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      const { data, error } = await supabase
        .from('adoptions')
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            requirements,
            breeds (
              id,
              name
            )
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!listingId,
  });
};

// Query to get adoptions by user (seeker)
export const useAdoptionsByUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.byUser(userId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('adoptions')
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `)
        .eq('seeker_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

// Query to get a single adoption by ID
export const useAdoption = (adoptionId: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.detail(adoptionId),
    queryFn: async (): Promise<AdoptionWithListing | null> => {
      if (!adoptionId) return null;

      const { data, error } = await supabase
        .from('adoptions')
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            reservation_fee,
            photos,
            owner_id,
            birth_date,
            available_date,
            number_of_puppies,
            pet_name,
            pet_age,
            pet_gender,
            location_text,
            created_at,
            breeds (
              id,
              name
            ),
            users (
              id,
              display_name,
              email,
              phone,
              profile_photo_url,
              location_text,
              created_at,
              breeder_profiles (
                id,
                kennel_name,
                kennel_location
              )
            )
          ),
          users (
            id,
            display_name,
            email,
            phone,
            profile_photo_url,
            location_text,
            created_at,
            seeker_profiles (
              id,
              experience_level,
              has_allergies,
              has_children,
              has_other_pets
            )
          )
        `)
        .eq('id', adoptionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!adoptionId,
  });
};

// Query to get adoptions received by a breeder (for their listings)
export const useAdoptionsReceived = (breederId?: string) => {
  return useQuery({
    queryKey: queryKeys.adoptions.received(breederId),
    queryFn: async (): Promise<AdoptionWithListing[]> => {
      if (!breederId) return [];

      // First get all listings by this breeder
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id')
        .eq('owner_id', breederId);

      if (listingsError) throw listingsError;
      if (!listings || listings.length === 0) return [];

      const listingIds = listings.map(l => l.id);

      const { data, error } = await supabase
        .from('adoptions')
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `)
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!breederId,
  });
};

// Mutation to create a new adoption
export const useCreateAdoption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adoptionData: {
      listing_id: string;
      application_data: Record<string, any>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('adoptions')
        .insert({
          listing_id: adoptionData.listing_id,
          seeker_id: user.id,
          status: 'submitted',
          application_data: adoptionData.application_data,
        })
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          )
        `)
        .single();

      if (error) throw error;

      // Add status history entry
      await supabase
        .from('adoption_status_history')
        .insert({
          adoption_id: data.id,
          status: 'submitted',
          created_by: user.id,
        });

      return data;
    },
    onSuccess: async (data) => {
      // Create notification for breeder
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: data.listings.owner_id,
            type: 'application_received',
            title: 'New Adoption Application Received',
            body: `${data.users?.display_name || 'Someone'} applied for ${data.listings.title}`,
            target_type: 'adoption',
            target_id: data.listings.id,
            meta: {
              adoptionId: data.id,
              listingId: data.listings.id,
            },
          });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.adoptions.byUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.adoptions.received() });
    },
  });
};

// Mutation to update adoption status
export const useUpdateAdoption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: UpdateAdoptionData
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('adoptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          listings (
            id,
            title,
            type,
            price,
            photos,
            owner_id,
            breeds (
              id,
              name
            )
          ),
          users (
            id,
            display_name,
            email,
            profile_photo_url
          )
        `)
        .single();

      if (error) throw error;

      // Add status history entry if status changed
      if (updates.status) {
        await supabase
          .from('adoption_status_history')
          .insert({
            adoption_id: id,
            status: updates.status,
            notes: updates.application_data?.response_message,
            created_by: user?.id,
          });
      }

      return data;
    },
    onSuccess: async (data) => {
      // Automatically reserve listing when adoption is approved
      if (data.status === 'approved') {
        try {
          await supabase
            .from('listings')
            .update({
              status: 'reserved',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.listing_id);
        } catch (reserveError) {
          console.error('Failed to reserve listing:', reserveError);
        }
      }

      if (data.status === 'completed') {
        try {
          await supabase
            .from('listings')
            .update({
              status: 'sold',
              updated_at: new Date().toISOString()
            })
            .eq('id', data.listing_id);
        } catch (completeError) {
          console.error('Failed to complete listing:', completeError);
        }
      }

      // Create notification for seeker when status changes
      if (data.status === 'pending' || data.status === 'approved' || data.status === 'rejected' || data.status === 'completed') {
        try {
          let title = '';
          let body = '';
          const listingTitle = data.listings?.title || 'listing';

          switch (data.status) {
            case 'pending':
              title = 'Adoption Under Review';
              body = `Your adoption application for ${listingTitle} is now being reviewed by the breeder`;
              break;
            case 'approved':
              title = 'Adoption Application Approved';
              body = `Congratulations! Your adoption application for ${listingTitle} has been approved.`;
              break;
            case 'rejected':
              title = 'Adoption Application Not Approved';
              body = `Your adoption application for ${listingTitle} was not approved at this time`;
              break;
            case 'completed':
              title = 'Adoption Completed';
              body = `Your adoption process for ${listingTitle} has been completed successfully`;
              break;
          }

          await supabase
            .from('notifications')
            .insert({
              user_id: data.seeker_id,
              type: 'adoption_status_changed',
              title,
              body,
              target_type: 'adoption',
              target_id: data.listings?.id,
              meta: {
                adoptionId: data.id,
                listingId: data.listings?.id,
                status: data.status,
              },
            });
        } catch (notificationError) {
          console.error('Failed to create status change notification:', notificationError);
        }
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.adoptions.all() });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

export * from './useAdoptions';
