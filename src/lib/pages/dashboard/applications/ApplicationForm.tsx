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
  Checkbox,
  Text,
  Alert,
  AlertIcon,
  useToast,
  Box,
  Divider,
  HStack,
  Badge,
  Avatar,
  SimpleGrid,
} from '@chakra-ui/react';
import { useCreateApplication } from '../../../hooks/queries/useApplications';
import { useUserProfile } from '../../../hooks/queries';
import { useSeekerProfile } from '../../../hooks/queries/useSeekerProfile';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
}

interface ApplicationData {
  message: string;
  contact_preference: string;
  timeline: string;
  budget_range: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  isOpen,
  onClose,
  listing,
}) => {
  const toast = useToast();
  const { data: userProfile } = useUserProfile();
  const { data: seekerProfile } = useSeekerProfile(userProfile?.id);
  const createApplicationMutation = useCreateApplication();

  // Initialize form with application-specific data only
  const [formData, setFormData] = useState<ApplicationData>({
    message: '',
    contact_preference: 'email',
    timeline: '',
    budget_range: '',
  });

  const [errors, setErrors] = useState<Partial<ApplicationData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationData> = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a message explaining why you want this pet';
    }

    if (!formData.timeline) {
      newErrors.timeline = 'Please specify your timeline for adoption';
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
      // Prepare application data for the JSONB field - only application-specific fields
      const applicationData = {
        message: formData.message,
        contact_preference: formData.contact_preference,
        timeline: formData.timeline,
        budget_range: formData.budget_range,
        submitted_at: new Date().toISOString(),
      };

      await createApplicationMutation.mutateAsync({
        listing_id: listing.id,
        application_data: applicationData,
      });

      toast({
        title: 'Application submitted!',
        description: 'Your application has been sent to the breeder. You will be notified of any updates.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form and close modal
      setFormData({
        message: '',
        contact_preference: 'email',
        timeline: '',
        budget_range: '',
      });
      setErrors({});
      onClose();

    } catch (error) {
      toast({
        title: 'Application failed',
        description: error.message || 'Failed to submit application. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="lg">Apply for {getListingTitle()}</Text>
            <HStack>
              <Badge colorScheme="blue">{listing.type === 'litter' ? 'Litter' : 'Single Pet'}</Badge>
              <Badge colorScheme="green">KSH {listing.price?.toLocaleString()}</Badge>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Listing Summary */}
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="semibold" mb={2}>Listing Summary</Text>
                <SimpleGrid columns={2} spacing={2} fontSize="sm">
                  <Text><strong>Breed:</strong> {listing.breeds?.name}</Text>
                  <Text><strong>Type:</strong> {listing.type}</Text>
                  {listing.type === 'litter' ? (
                    <>
                      <Text><strong>Birth Date:</strong> {new Date(listing.birth_date).toLocaleDateString()}</Text>
                      <Text><strong>Puppies:</strong> {listing.number_of_puppies}</Text>
                    </>
                  ) : (
                    <>
                      <Text><strong>Age:</strong> {listing.pet_age}</Text>
                      <Text><strong>Gender:</strong> {listing.pet_gender}</Text>
                    </>
                  )}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Listing Requirements */}
              {listing.requirements && Object.keys(listing.requirements).length > 0 && (
                <Box p={4} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                  <Text fontWeight="semibold" mb={3} color="orange.800">Listing Requirements</Text>
                  <SimpleGrid columns={1} spacing={2} fontSize="sm">
                    {Object.keys(listing.requirements).map((key) => {
                      const value = listing.requirements[key];
                      if (!value) return null;

                      const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);

                      return (
                        <Text key={key}>
                          <strong>{displayKey}:</strong> {displayValue}
                        </Text>
                      );
                    })}
                  </SimpleGrid>
                  <Text fontSize="xs" color="orange.600" mt={2}>
                    Please review these requirements carefully before submitting your application.
                  </Text>
                </Box>
              )}

              {/* Application Form - Only application-specific fields */}
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!errors.message}>
                  <FormLabel>Why do you want this pet?</FormLabel>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell the breeder about yourself, your experience with pets, and why you think you'd be a good home for this pet..."
                    rows={4}
                    maxLength={1000}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {formData.message.length}/1000 characters
                  </Text>
                  {errors.message && (
                    <Text fontSize="sm" color="red.500">{errors.message}</Text>
                  )}
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.timeline}>
                    <FormLabel>When are you ready to adopt?</FormLabel>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select timeline</option>
                      <option value="immediately">Immediately</option>
                      <option value="1_week">Within 1 week</option>
                      <option value="2_weeks">Within 2 weeks</option>
                      <option value="1_month">Within 1 month</option>
                      <option value="3_months">Within 3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                    {errors.timeline && (
                      <Text fontSize="sm" color="red.500">{errors.timeline}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <select
                      value={formData.contact_preference}
                      onChange={(e) => handleInputChange('contact_preference', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Budget Range (Optional)</FormLabel>
                  <select
                    value={formData.budget_range}
                    onChange={(e) => handleInputChange('budget_range', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select budget range</option>
                    <option value="under_50k">Under KSH 50,000</option>
                    <option value="50k_100k">KSH 50,000 - 100,000</option>
                    <option value="100k_200k">KSH 100,000 - 200,000</option>
                    <option value="over_200k">Over KSH 200,000</option>
                  </select>
                </FormControl>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={createApplicationMutation.isPending}
            >
              Submit Application
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
