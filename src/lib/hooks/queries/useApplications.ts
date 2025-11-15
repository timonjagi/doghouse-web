import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { queryKeys } from '../../queryKeys';
import { Application } from '../../../../db/schema';

// Extended Application type with related data
export interface ApplicationWithListing extends Application {
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
  };
  users: {
    id: string;
    display_name: string;
    email: string;
    profile_photo_url: string | null;
  };
}


interface UpdateApplicationData {
  status?: string;
  reservation_paid?: boolean;
  contract_signed?: boolean;
  payment_completed?: boolean;
  application_data?: any
}
// Query to get applications for a specific listing
export const useApplicationsByListing = (listingId: string) => {
  return useQuery({
    queryKey: queryKeys.applications.byListing(listingId),
    queryFn: async (): Promise<ApplicationWithListing[]> => {
      const { data, error } = await supabase
        .from('applications')
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

// Query to get applications by user (seeker)
export const useApplicationsByUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.applications.byUser(userId),
    queryFn: async (): Promise<ApplicationWithListing[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('applications')
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

// Query to get a single application by ID
export const useApplication = (applicationId: string) => {
  return useQuery({
    queryKey: queryKeys.applications.detail(applicationId),
    queryFn: async (): Promise<ApplicationWithListing | null> => {
      if (!applicationId) return null;

      const { data, error } = await supabase
        .from('applications')
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
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!applicationId,
  });
};

// Query to get applications received by a breeder (for their listings)
export const useApplicationsReceived = (breederId?: string) => {
  return useQuery({
    queryKey: queryKeys.applications.received(breederId),
    queryFn: async (): Promise<ApplicationWithListing[]> => {
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
        .from('applications')
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

// Mutation to create a new application
export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: {
      listing_id: string;
      application_data: Record<string, any>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('applications')
        .insert({
          listing_id: applicationData.listing_id,
          seeker_id: user.id,
          status: 'submitted',
          application_data: applicationData.application_data,
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
            title: 'New Application Received',
            body: `${data.users?.display_name || 'Someone'} applied for ${data.listings.title}`,
            target_type: 'application',
            target_id: data.listings.id,
            meta: {
              applicationId: data.id,
              listingId: data.listings.id,
            },
          });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the application creation if notification fails
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.received() });
    },
  });
};

// Mutation to update application status
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: UpdateApplicationData
    }) => {
      const { data, error } = await supabase
        .from('applications')
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
      return data;
    },
    onSuccess: async (data) => {
      // Automatically reserve listing when application is approved
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
          // Don't fail the approval if reservation fails
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
          // Don't fail the completion if completion fails
        }
      }

      // Create notification for seeker when status changes (key transitions only)
      if (data.status === 'pending' || data.status === 'approved' || data.status === 'rejected' || data.status === 'completed') {
        try {
          let title = '';
          let body = '';

          switch (data.status) {
            case 'pending':
              title = 'Application Under Review';
              body = `Your application for ${data.listings.title} is now being reviewed by the breeder`;
              break;
            case 'approved':
              title = 'Application Approved';
              body = `Congratulations! Your application for ${data.listings.title} has been approved and the listing is now temporarily reserved for you. Please complete payment within 24 hours.`;
              break;
            case 'rejected':
              title = 'Application Not Approved';
              body = `Your application for ${data.listings.title} was not approved at this time`;
              break;
            case 'completed':
              title = 'Application Completed';
              body = `Your application for ${data.listings.title} has been completed successfully`;
              break;
          }

          await supabase
            .from('notifications')
            .insert({
              user_id: data.seeker_id,
              type: 'application_status_changed',
              title,
              body,
              target_type: 'application',
              target_id: data.listings.id,
              meta: {
                applicationId: data.id,
                listingId: data.listings.id,
                status: data.status,
              },
            });
        } catch (notificationError) {
          console.error('Failed to create status change notification:', notificationError);
          // Don't fail the status update if notification fails
        }
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
      // Invalidate listings to show updated status
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
};

// Export all hooks
export * from './useApplications';
