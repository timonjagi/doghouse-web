import { useQuery } from '@tanstack/react-query';
import { useCreateConversation, useConversations } from './useConversations';
import { useCurrentUser } from './useAuth';
import { useUserProfile } from './useUserProfile';
import { useAdoption } from './useAdoptions';
import { useListings } from './useListings';
import { queryKeys } from '../../queryKeys';
import { supabase } from '../../supabase/client';

// Hook for adoption-related conversations
export const useAdoptionConversation = (adoptionId: string) => {
  const { data: user } = useCurrentUser();
  const conversationsQuery = useConversations(user?.id);
  const createConversationMutation = useCreateConversation();

  // Find existing adoption conversation
  const existingConversation = conversationsQuery.data?.find(
    conv => conv.context_type === 'adoption' && conv.context_id === adoptionId
  );

  const createAdoptionConversation = async (listingData: any, participants: string[]) => {
    if (!user?.id) return null;

    const contextData = {
      listing_title: listingData?.title || 'Unknown Listing',
      listing_id: listingData?.id,
      adoption_id: adoptionId,
      breeder_id: listingData?.owner_id,
      seeker_id: user.id,
      status: 'active'
    };

    const conversation = await createConversationMutation.mutateAsync({
      contextType: 'adoption',
      contextId: adoptionId,
      participants: [user.id, ...participants],
      title: `Adoption: ${contextData.listing_title}`,
      contextData,
      createdBy: user.id
    });

    return conversation;
  };

  return {
    conversation: existingConversation,
    createConversation: createAdoptionConversation,
    isLoading: createConversationMutation.isPending
  };
};

// Hook for listing-related conversations
export const useListingConversation = (listingId: string) => {
  const { data: user } = useCurrentUser();
  const conversationsQuery = useConversations(user?.id);
  const createConversationMutation = useCreateConversation();

  // Find existing listing conversation
  const existingConversation = conversationsQuery.data?.find(
    conv => conv.context_type === 'listing' && conv.context_id === listingId
  );

  const createListingConversation = async (listingData: any, participants: string[]) => {
    if (!user?.id) return null;

    const contextData = {
      listing_title: listingData?.title || 'Unknown Listing',
      listing_id: listingId,
      listing_type: listingData?.type,
      breeder_id: listingData?.owner_id,
      inquiry_type: 'general'
    };

    const conversation = await createConversationMutation.mutateAsync({
      contextType: 'listing',
      contextId: listingId,
      participants: [user.id, ...participants],
      title: `Listing: ${contextData.listing_title}`,
      contextData,
      createdBy: user.id
    });

    return conversation;
  };

  return {
    conversation: existingConversation,
    createConversation: createListingConversation,
    isLoading: createConversationMutation.isPending
  };
};

// Hook for support conversations
export const useSupportConversation = (ticketId?: string) => {
  const { data: user } = useCurrentUser();
  const conversationsQuery = useConversations(user?.id);
  const createConversationMutation = useCreateConversation();

  // Find existing support conversation
  const existingConversation = conversationsQuery.data?.find(
    conv => conv.context_type === 'support' &&
      (!ticketId || conv.context_id === ticketId)
  );

  const createSupportConversation = async (subject: string, ticketId?: string) => {
    if (!user?.id) return null;

    const contextData = {
      subject,
      ticket_id: ticketId,
      priority: 'normal',
      category: 'general'
    };

    const conversation = await createConversationMutation.mutateAsync({
      contextType: 'support',
      contextId: ticketId,
      participants: [user.id, 'admin'], // Admin will be added by system
      title: `Support: ${subject}`,
      contextData,
      createdBy: user.id
    });

    return conversation;
  };

  return {
    conversation: existingConversation,
    createConversation: createSupportConversation,
    isLoading: createConversationMutation.isPending
  };
};

// Hook for finding or creating conversation by participants (general messaging)
export const useDirectConversation = (otherUserId: string) => {
  const { data: user } = useCurrentUser();
  const { data: userProfile } = useUserProfile();
  const conversationsQuery = useConversations(user?.id);
  const createConversationMutation = useCreateConversation();

  // Find existing direct conversation with this user
  const existingConversation = conversationsQuery.data?.find(
    conv => conv.context_type === 'general' &&
      (conv.participants as string[])?.includes(otherUserId) &&
      (conv.participants as string[])?.length === 2
  );

  const createDirectConversation = async (otherUserData: any) => {
    if (!user?.id) return null;

    const participants = [user.id, otherUserId].sort(); // Consistent ordering

    const contextData = {
      participant_names: [userProfile?.display_name || 'User', otherUserData.display_name || 'User'],
      is_direct: true
    };

    const conversation = await createConversationMutation.mutateAsync({
      contextType: 'general',
      participants,
      title: `${otherUserData.display_name}`,
      contextData,
      createdBy: user.id
    });

    return conversation;
  };

  return {
    conversation: existingConversation,
    createConversation: createDirectConversation,
    isLoading: createConversationMutation.isPending
  };
};

// Enhanced hook to fetch conversation with rich contextual data
export const useConversationWithContext = (conversationId: string) => {
  return useQuery({
    queryKey: queryKeys.conversations.withContext(conversationId),
    queryFn: async () => {
      // Get conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      let contextData = null;

      // Fetch contextual data based on conversation type
      if (conversation.context_type === 'adoption' && conversation.context_id) {
        // Fetch adoption with related listing and users
        const { data: adoption, error: adoptionError } = await supabase
          .from('adoptions')
          .select(`
            *,
            listings:listing_id (
              id,
              title,
              pet_name,
              pet_age,
              pet_gender,
              price,
              photos,
              breeds:breed_id (name),
              user_breeds:user_breed_id (notes, images),
              users:owner_id (display_name, profile_photo_url, breeder_profiles:breeder_profiles(kennel_name))
            ),
            users:seeker_id (display_name, profile_photo_url)
          `)
          .eq('id', conversation.context_id)
          .single();

        if (!adoptionError && adoption) {
          contextData = {
            type: 'adoption',
            adoption,
            status: adoption.status,
            timeline: {
              submitted: adoption.created_at,
              reserved: adoption.reservation_paid,
              paid: adoption.payment_completed,
              completed: adoption.contract_signed
            },
            pet: {
              name: adoption.listings?.pet_name || 'Pet',
              age: adoption.listings?.pet_age,
              gender: adoption.listings?.pet_gender,
              breed: adoption.listings?.breeds?.name,
              photos: adoption.listings?.photos || []
            },
            seeker: adoption.users,
            breeder: adoption.listings?.users,
            price: adoption.listings?.price,
            reservation_fee: adoption.listings?.reservation_fee
          };
        }
      } else if (conversation.context_type === 'listing' && conversation.context_id) {
        // Fetch listing with related breeder info
        const { data: listing, error: listingError } = await supabase
          .from('listings')
          .select(`
            *,
            breeds:breed_id (name),
            user_breeds:user_breed_id (notes, images),
            users:owner_id (
              display_name,
              profile_photo_url,
              breeder_profiles:breeder_profiles(kennel_name, facility_type)
            )
          `)
          .eq('id', conversation.context_id)
          .single();

        if (!listingError && listing) {
          contextData = {
            type: 'listing',
            listing,
            title: listing.title,
            listing_type: listing.type,
            pet: {
              name: listing.pet_name,
              age: listing.pet_age,
              gender: listing.pet_gender,
              breed: listing.breeds?.name
            },
            price: listing.price,
            status: listing.status,
            location: listing.location_text,
            photos: listing.photos || [],
            breeder: listing.users,
            available_date: listing.available_date
          };
        }
      } else if (conversation.context_type === 'support') {
        // Support context - could be enhanced with ticket data later
        contextData = {
          type: 'support',
          subject: conversation.context_data?.subject,
          priority: conversation.context_data?.priority || 'normal',
          category: conversation.context_data?.category || 'general',
          ticket_id: conversation.context_id
        };
      }

      return {
        ...conversation,
        contextData
      };
    },
    enabled: !!conversationId,
  });
};

// Hook to get adoption context for a conversation
export const useAdoptionContext = (conversationId: string) => {
  const conversationQuery = useConversationWithContext(conversationId);

  return {
    ...conversationQuery,
    data: conversationQuery.data?.contextData?.type === 'adoption' ? conversationQuery.data.contextData : null
  };
};

// Hook to get listing context for a conversation
export const useListingContext = (conversationId: string) => {
  const conversationQuery = useConversationWithContext(conversationId);

  return {
    ...conversationQuery,
    data: conversationQuery.data?.contextData?.type === 'listing' ? conversationQuery.data.contextData : null
  };
};

// Hook to get support context for a conversation
export const useSupportContext = (conversationId: string) => {
  const conversationQuery = useConversationWithContext(conversationId);

  return {
    ...conversationQuery,
    data: conversationQuery.data?.contextData?.type === 'support' ? conversationQuery.data.contextData : null
  };
};

// Utility hook for getting conversation context data
export const useConversationContext = (conversationId: string) => {
  const conversationsQuery = useConversations();

  const conversation = conversationsQuery.data?.find(conv => conv.id === conversationId);

  if (!conversation) {
    return {
      contextType: null,
      contextId: null,
      contextData: null,
      isAdoption: false,
      isListing: false,
      isSupport: false,
      isGeneral: false
    };
  }

  return {
    contextType: conversation.context_type,
    contextId: conversation.context_id,
    contextData: conversation.context_data,
    isAdoption: conversation.context_type === 'adoption',
    isListing: conversation.context_type === 'listing',
    isSupport: conversation.context_type === 'support',
    isGeneral: conversation.context_type === 'general'
  };
};
