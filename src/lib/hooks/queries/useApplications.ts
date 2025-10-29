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
    photos: string[];
    owner_id: string;
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
            photos,
            owner_id,
            birth_date,
            available_date,
            number_of_puppies,
            pet_name,
            pet_age,
            pet_gender,
            location_text,
            breeds (
              id,
              name
            ),
            owner_profile:users!listings_owner_id_fkey (
              id,
              display_name,
              email,
              phone,
              profile_photo_url,
              location_text,
              created_at
            )
          ),
          users (
            id,
            display_name,
            email,
            phone,
            profile_photo_url,
            location_text,
            created_at
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
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string;
      status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'completed';
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
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
      // Create notification for seeker when status changes
      if (data.status === 'approved' || data.status === 'rejected') {
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: data.seeker_id,
              type: 'application_status_changed',
              title: `Application ${data.status === 'approved' ? 'Approved' : 'Rejected'}`,
              body: `Your application for ${data.listings.title} has been ${data.status}`,
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

      queryClient.invalidateQueries({ queryKey: queryKeys.applications.byUser() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.received() });
    },
  });
};

// Export all hooks
export * from './useApplications';
