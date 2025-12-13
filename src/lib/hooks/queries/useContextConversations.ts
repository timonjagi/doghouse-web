import { useCreateConversation, useConversations } from './useConversations';
import { useCurrentUser } from './useAuth';

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
      participant_names: [user.display_name || 'User', otherUserData.display_name || 'User'],
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
