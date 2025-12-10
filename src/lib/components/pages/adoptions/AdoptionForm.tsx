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
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useCreateAdoption } from '../../../hooks/queries/useAdoptions';
import { useRouter } from 'next/router';

interface AdoptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
}

interface AdoptionData {
  message?: string;
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

  const createAdoptionMutation = useCreateAdoption();

  // Initialize form with adoption-specific data only
  const [formData, setFormData] = useState<AdoptionData>({
    message: '',
    contact_preference: 'email',
    timeline: '',
    offer_price: undefined,
    quantity: listing.type === 'litter' ? 1 : undefined,
  });

  const [errors, setErrors] = useState<Partial<AdoptionData>>({});

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.timeline) {
      newErrors.timeline = 'Please specify your timeline for adoption';
    }

    if (listing.type === 'litter' && !formData.quantity) {
      newErrors.quantity = 'Please specify the number of puppies you want to adopt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare adoption data for the JSONB field - only adoption-specific fields
      const adoptionData = {
        // message: formData.message,
        contact_preference: formData.contact_preference,
        timeline: formData.timeline,
        offer_price: formData.offer_price,
        ...(listing.type === 'litter' && { quantity: formData.quantity }),
        submitted_at: new Date().toISOString(),
      };

      const result = await createAdoptionMutation.mutateAsync({
        listing_id: listing.id,
        application_data: adoptionData,
      });

      toast({
        title: 'Adoption submitted!',
        description: 'Your adoption request has been sent to the breeder. You will be notified of any updates.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      if (result) {
        router.push('/dashboard/adoptions/' + result.id)
      }
      // Reset form and close modal
      setFormData({
        message: '',
        contact_preference: 'email',
        timeline: '',
        offer_price: undefined,
        quantity: listing.type === 'litter' ? 1 : undefined,
      });
      setErrors({});
      onClose();

    } catch (error) {
      toast({
        title: 'Adoption failed',
        description: error.message || 'Failed to submit adoption. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field: keyof AdoptionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
            <Text fontSize="lg" fontWeight="bold">Apply for {getListingTitle()}</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">

              {/* Adoption Form - Enhanced fields */}
              <VStack spacing={4} align="stretch">

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.timeline}>
                    <FormLabel>When are you ready to adopt?</FormLabel>
                    <Select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                    >
                      <option value="">Select timeline</option>
                      <option value="immediately">Immediately</option>
                      <option value="1_week">Within 1 week</option>
                      <option value="2_weeks">Within 2 weeks</option>
                      <option value="1_month">Within 1 month</option>
                      <option value="3_months">Within 3 months</option>
                      <option value="flexible">Flexible</option>
                    </Select>
                    {errors.timeline && (
                      <Text fontSize="sm" color="red.500">{errors.timeline}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Your Offer Price (KSH)</FormLabel>
                    <Input
                      type="number"
                      placeholder={`e.g., ${listing.price || 'Enter amount'}`}
                      value={formData.offer_price || ''}
                      onChange={(e) => handleInputChange('offer_price', parseInt(e.target.value) || undefined)}
                    />
                    <Text fontSize="xs" color="gray.600">
                      Leave empty to accept the listing price
                    </Text>
                  </FormControl>
                </SimpleGrid>

                {/* Conditional fields based on listing type */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {/* Quantity field for litters */}
                  {listing.type === 'litter' && (
                    <FormControl>
                      <FormLabel>How many puppies are you interested in?</FormLabel>
                      <NumberInput
                        min={1}
                        max={listing.number_of_puppies}
                        value={formData.quantity}
                        onChange={(_, value) => handleInputChange('quantity', value)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text fontSize="xs" color="gray.600">
                        Maximum available: {listing.number_of_puppies} puppies
                      </Text>
                    </FormControl>
                  )}

                </SimpleGrid>

                {/* Message field */}
                <FormControl>
                  <FormLabel>Message to Breeder (optional)</FormLabel>
                  <Textarea
                    placeholder="Tell the breeder why you're interested in this pet and what you're looking for in a companion..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                  />
                </FormControl>
              </VStack>

              <Divider />

              {/* Adoption Terms and Expectations */}
              <Alert status="info" borderRadius="md">
                <Box>
                  <AlertDescription>
                    <Text fontWeight="semibold" mb={2}>What happens after you apply?</Text>
                    <List spacing={1} fontSize="sm">
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Your adoption will be reviewed by the breeder
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        If approved, you'll need to pay the reservation fee within 24 hours
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        Reservation fee will be deducted from your final payment
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        You'll receive updates on the adoption process timeline
                      </ListItem>
                    </List>
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={createAdoptionMutation.isPending}
            >
              Submit Adoption
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal >
  );
};
