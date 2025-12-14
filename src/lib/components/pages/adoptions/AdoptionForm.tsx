import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Alert,
  useToast,
  Box,
  Divider,
  SimpleGrid,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
  Badge,
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';
import { useCreateAdoption } from '../../../hooks/queries/useAdoptions';
import { useListingConversation, useAdoptionConversation } from '../../../hooks/queries/useContextConversations';
import { useSendMessage } from '../../../hooks/queries/useConversations';
import { useCurrentUser } from '../../../hooks/queries/useAuth';
import { useRouter } from 'next/router';

interface AdoptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
}

interface AdoptionData {
  message: string;
  contact_preference: string;
  timeline: string;
  offer_price?: number;
  quantity?: number; // For litters only
}

export const AdoptionForm: React.FC<AdoptionFormProps> = ({
  isOpen,
  onClose,
  listing,
}) => {
  const toast = useToast();
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const createAdoptionMutation = useCreateAdoption();
  const { createConversation: createListingConversation } = useListingConversation(listing.id);
  // Note: useAdoptionConversation requires adoptionId, which we don't have yet until we create it.
  // We'll handle conversation creation manually or via a helper after mutation.
  const sendMessageMutation = useSendMessage();

  const isSoldOut = listing.status === 'sold' || listing.status === 'sold_out';

  // Initialize form
  const [formData, setFormData] = useState<AdoptionData>({
    message: '',
    contact_preference: 'email',
    timeline: '',
    offer_price: undefined,
    quantity: listing.type === 'litter' ? 1 : undefined,
  });

  const [errors, setErrors] = useState<Partial<AdoptionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!isSoldOut) {
      if (!formData.timeline) {
        newErrors.timeline = 'Please specify your timeline for adoption';
      }

      if (listing.type === 'litter' && !formData.quantity) {
        newErrors.quantity = 'Please specify the number of puppies you want to adopt';
      }
    } else {
      if (!formData.message.trim()) {
        newErrors.message = 'Please enter a message to the seller.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSoldOut) {
        // Handle Sold Out - General Inquiry (Listing Conversation)
        const conversation = await createListingConversation(listing, [listing.owner_id]);

        if (conversation && formData.message) {
          await sendMessageMutation.mutateAsync({
            conversationId: conversation.id,
            senderId: user.id,
            content: formData.message
          });
        }

        toast({
          title: 'Message Sent',
          description: 'Your inquiry has been sent to the breeder.',
          status: 'success',
          duration: 5000,
        });

        if (conversation) {
          router.push(`/dashboard/inbox/${conversation.id}`);
        }

      } else {
        // Handle Available - Create Adoption & Conversation
        const adoptionData = {
          // message: formData.message, // Message goes to conversation
          contact_preference: formData.contact_preference,
          timeline: formData.timeline,
          offer_price: formData.offer_price,
          ...(listing.type === 'litter' && { quantity: formData.quantity }),
          submitted_at: new Date().toISOString(),
        };

        const adoption = await createAdoptionMutation.mutateAsync({
          listing_id: listing.id,
          application_data: adoptionData,
        });

        // Now create adoption conversation
        // We need to import the create function or use a hook that allows dynamic ID.
        // Since useAdoptionConversation takes ID, we can't easily use it here for a NEW adoption.
        // However, we can use useCreateConversation directly if we want, or rely on a modified flow.
        // Assuming we can redirect to a page that handles it, or just create it here.
        // Let's use the hook logic but manually since hook requires prop.
        // Actually, we can just fetch the hook inside component, but `adoption` isn't state.
        // We can use a direct helper if available, or just create generic conversation.

        // Better approach: Redirect to inbox with adoption ID to init conversation? No, user wants instant feedback.
        // We need to create the conversation HERE.
        // We'll assume we can use `useAdoptionConversation`'s create logic.
        // BUT `useAdoptionConversation` is bound to `adoptionId`.

        // Let's manually create conversation here.
        // We need access to `useCreateConversation`.
        // I will assume `useAdoptionConversation` logic is replicable here.

        // ... See Reference Logic ...
        // The `useAdoptionConversation` hook uses `useCreateConversation`.
        // We can use `useCreateConversation` directly.
      }

    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error.message || 'Failed to process request.',
        status: 'error',
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  // Helper to handle creation since hook is top-level only
  // const { createConversation } = useListingConversation(listing.id);
  // Wait, `createConversationMutation` is not exposed directly by `useListingConversation` in my previous view.
  // I need to use `useCreateConversation` directly for the Adoption case since I don't have the hook instance for the new adoption yet.
  //  const createConvMutation = useSendMessage(); // Wrong hook
  // Re-import useCreateConversation
  // See imports.

  // Actually, I'll implementing `handleSubmit` fully below.
  return (
    <AdoptionFormContent
      isOpen={isOpen}
      onClose={onClose}
      listing={listing}
      isSoldOut={isSoldOut}
      user={user}
    />
  )
};

// Separated Content Component to cleanly use hooks
import { useCreateConversation } from '../../../hooks/queries/useConversations';

const AdoptionFormContent = ({ isOpen, onClose, listing, isSoldOut, user }: any) => {
  const toast = useToast();
  const router = useRouter();
  const createAdoptionMutation = useCreateAdoption();
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();

  const [formData, setFormData] = useState<AdoptionData>({
    message: '',
    contact_preference: 'email',
    timeline: '',
    offer_price: undefined,
    quantity: listing.type === 'litter' ? 1 : undefined,
  });

  const [errors, setErrors] = useState<Partial<AdoptionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!isSoldOut) {
      if (!formData.timeline) {
        newErrors.timeline = 'Please specify your timeline for adoption';
      }

      if (listing.type === 'litter' && !formData.quantity) {
        newErrors.quantity = 'Please specify the number of puppies you want to adopt';
      }
    } else {
      if (!formData.message || !formData.message.trim()) {
        newErrors.message = 'Please enter a message.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AdoptionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;
    setIsSubmitting(true);

    try {
      let conversationId;

      if (isSoldOut) {
        // Create Listing Conversation
        const contextData = {
          listing_title: listing?.title || 'Unknown Listing',
          listing_id: listing?.id,
          owner_id: listing?.owner_id,
          seeker_id: user.id,
        };

        const conv = await createConversationMutation.mutateAsync({
          contextType: 'listing',
          contextId: listing.id,
          participants: [user.id, listing.owner_id],
          title: `Listing: ${listing.title}`,
          contextData,
          createdBy: user.id
        });
        conversationId = conv.id;
      } else {
        // Create Adoption Record
        const adoptionData = {
          contact_preference: formData.contact_preference,
          timeline: formData.timeline,
          offer_price: formData.offer_price,
          ...(listing.type === 'litter' && { quantity: formData.quantity }),
          submitted_at: new Date().toISOString(),
          response_message: formData.message // Include message in adoption data too just in case
        };

        const adoption = await createAdoptionMutation.mutateAsync({
          listing_id: listing.id,
          application_data: adoptionData,
        });

        // Create Adoption Conversation
        const contextData = {
          listing_title: listing?.title || 'Unknown Listing',
          listing_id: listing?.id,
          adoption_id: adoption.id,
          breeder_id: listing?.owner_id,
          seeker_id: user.id,
          status: 'active'
        };

        const conv = await createConversationMutation.mutateAsync({
          contextType: 'adoption',
          contextId: adoption.id, // Context ID is ADOPTION ID
          participants: [user.id, listing.owner_id],
          title: `Adoption: ${listing.title}`,
          contextData,
          createdBy: user.id
        });
        conversationId = conv.id;
      }

      // Send Initial Message
      if (conversationId && formData.message) {
        await sendMessageMutation.mutateAsync({
          conversationId,
          senderId: user.id,
          content: formData.message
        });
      }

      toast({
        title: isSoldOut ? 'Inquiry Sent' : 'Application Submitted',
        description: 'Redirecting to conversation...',
        status: 'success',
        duration: 2000,
      });

      router.push(`/dashboard/inbox/${conversationId}`);
      onClose();

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process request. Please try again.',
        status: 'error',
      });
      setIsSubmitting(false);
    }
  }

  const getListingTitle = () => {
    if (listing.title) return listing.title;
    if (listing.type === 'litter') {
      return `${listing.breeds?.name} Puppies`;
    } else {
      return `${listing.breeds?.name} ${listing.pet_age} old`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="lg" fontWeight="bold">
              {isSoldOut ? `Contact Seller about ${getListingTitle()}` : `Apply for ${getListingTitle()}`}
            </Text>
            {isSoldOut && <Badge colorScheme="red">Sold Out</Badge>}
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">

              {isSoldOut ? (
                <Alert status="info">
                  <InfoIcon mr={2} />
                  <Text fontSize="sm">
                    This listing is currently marked as sold. You can still message the seller for future availability or waitlist options.
                  </Text>
                </Alert>
              ) : (
                <Alert status="info" borderRadius="md">
                  <Box>
                    <AlertDescription>
                      <Text fontWeight="semibold" mb={2}>What happens after you apply?</Text>
                      <List spacing={1} fontSize="sm">
                        <ListItem><ListIcon as={CheckCircleIcon} color="green.500" />Breeder review</ListItem>
                        <ListItem><ListIcon as={CheckCircleIcon} color="green.500" />Chat in Inbox</ListItem>
                        <ListItem><ListIcon as={CheckCircleIcon} color="green.500" />Secure Payment</ListItem>
                      </List>
                    </AlertDescription>
                  </Box>
                </Alert>
              )}

              {!isSoldOut && (
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired isInvalid={!!errors.timeline}>
                      <FormLabel>Timeline</FormLabel>
                      <Select
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="immediately">Immediately</option>
                        <option value="1_week">Within 1 week</option>
                        <option value="flexible">Flexible</option>
                      </Select>
                      {errors.timeline && <Text fontSize="xs" color="red.500">{errors.timeline}</Text>}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Offer Price (KSH)</FormLabel>
                      <Input
                        type="number"
                        placeholder={listing.price}
                        value={formData.offer_price || ''}
                        onChange={(e) => handleInputChange('offer_price', parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                  </SimpleGrid>

                  {listing.type === 'litter' && (
                    <FormControl isRequired isInvalid={!!errors.quantity}>
                      <FormLabel>Number of Puppies</FormLabel>
                      <NumberInput min={1} max={listing.number_of_puppies} value={formData.quantity} onChange={(_, v) => handleInputChange('quantity', v)}>
                        <NumberInputField />
                        <NumberInputStepper><NumberIncrementStepper /><NumberDecrementStepper /></NumberInputStepper>
                      </NumberInput>
                      {errors.quantity && <Text fontSize="xs" color="red.500">{errors.quantity}</Text>}
                    </FormControl>
                  )}
                </VStack>
              )}

              <FormControl isRequired={isSoldOut} isInvalid={!!errors.message}>
                <FormLabel>Message to Breeder</FormLabel>
                <Textarea
                  placeholder={isSoldOut ? "Hi, I'm interested in this puppy. Is it still available?" : "Tell the breeder why you're interested..."}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                />
                {errors.message && <Text fontSize="xs" color="red.500">{errors.message}</Text>}
              </FormControl>

            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="brand" type="submit" isLoading={isSubmitting}>
              {isSoldOut ? 'Send Message' : 'Submit Application'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal >
  );
}
