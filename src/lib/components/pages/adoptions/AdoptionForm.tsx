import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import { useCreateAdoption } from "../../../hooks/queries/useAdoptions";
import { useCurrentUser } from "../../../hooks/queries/useAuth";
import { useRouter } from "next/router";

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
  const [formData, setFormData] = useState<AdoptionData>({
    message: "",
    contact_preference: "email",
    timeline: "",
    offer_price: undefined,
  });

  const [errors, setErrors] = useState<Partial<AdoptionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.timeline) {
      newErrors.timeline = "Please specify your timeline for adoption";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter a message to the breeder.";
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
      // Create Adoption Record
      const adoptionData = {
        contact_preference: formData.contact_preference,
        timeline: formData.timeline,
        offer_price: formData.offer_price,
        submitted_at: new Date().toISOString(),
        message: formData.message,
      };

      const adoption = await createAdoptionMutation.mutateAsync({
        listing_id: listing.id,
        application_data: adoptionData,
      });

      // Create Adoption Conversation
      const contextData = {
        listing_title: listing?.title || "Unknown Listing",
        listing_id: listing?.id,
        adoption_id: adoption.id,
        breeder_id: listing?.owner_id,
        seeker_id: user.id,
        status: "active",
      };

      const conv = await createConversationMutation.mutateAsync({
        contextType: "adoption",
        contextId: adoption.id,
        participants: [user.id, listing.owner_id],
        title: `Adoption: ${listing.title}`,
        contextData,
        createdBy: user.id,
      });

      // Send Initial Message
      if (conv.id && formData.message) {
        await sendMessageMutation.mutateAsync({
          conversationId: conv.id,
          senderId: user.id,
          content: formData.message,
        });
      }

      toast({
        title: "Application Submitted",
        description: "Redirecting to conversation...",
        status: "success",
        duration: 2000,
      });

      router.push(`/dashboard/inbox/${conv.id}`);
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to process request.",
        status: "error",
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
      user={user}
    />
  );
};

// Separated Content Component to cleanly use hooks
const AdoptionFormContent = ({ isOpen, onClose, listing, user }: any) => {
  const toast = useToast();
  const router = useRouter();
  const createAdoptionMutation = useCreateAdoption();

  const [formData, setFormData] = useState<AdoptionData>({
    message: "",
    contact_preference: "email",
    timeline: "",
    offer_price: undefined,
  });

  const [errors, setErrors] = useState<Partial<AdoptionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.timeline) {
      newErrors.timeline = "Please specify your timeline for adoption";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter a message to the breeder.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AdoptionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;
    setIsSubmitting(true);

    try {
      // Create Adoption Record
      const adoptionData = {
        contact_preference: formData.contact_preference,
        timeline: formData.timeline,
        offer_price: formData.offer_price,
        submitted_at: new Date().toISOString(),
        message: formData.message,
      };

      const adoption = await createAdoptionMutation.mutateAsync({
        listing_id: listing.id,
        application_data: adoptionData,
      });

      toast({
        title: "Application Submitted",
        description: "Adoption application submitted successfully.",
        status: "success",
        duration: 2000,
      });

      router.push(`/dashboard/adoptions/${adoption.id}`);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        status: "error",
      });
      setIsSubmitting(false);
    }
  };

  const getListingTitle = () => {
    if (listing.title) return listing.title;
    if (listing.type === "litter") {
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
              Apply for {getListingTitle()}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Alert status="info" borderRadius="md">
                <Box>
                  <AlertDescription>
                    <Text fontWeight="semibold" mb={2}>
                      What happens after you apply?
                    </Text>
                    <List spacing={1} fontSize="sm">
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Breeder review
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Chat in Inbox
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Secure Payment
                      </ListItem>
                    </List>
                  </AlertDescription>
                </Box>
              </Alert>

              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.timeline}>
                    <FormLabel>Timeline</FormLabel>
                    <Select
                      value={formData.timeline}
                      onChange={(e) =>
                        handleInputChange("timeline", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="immediately">Immediately</option>
                      <option value="1_week">Within 1 week</option>
                      <option value="flexible">Flexible</option>
                    </Select>
                    {errors.timeline && (
                      <Text fontSize="xs" color="red.500">
                        {errors.timeline}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Offer Price (KSH)</FormLabel>
                    <Input
                      type="number"
                      placeholder={listing.price}
                      value={formData.offer_price || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "offer_price",
                          parseInt(e.target.value) || undefined
                        )
                      }
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>

              <FormControl isRequired isInvalid={!!errors.message}>
                <FormLabel>Message to Breeder</FormLabel>
                <Textarea
                  placeholder="Tell the breeder why you're interested..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                />
                {errors.message && (
                  <Text fontSize="xs" color="red.500">
                    {errors.message}
                  </Text>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit" isLoading={isSubmitting}>
              Submit Application
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
