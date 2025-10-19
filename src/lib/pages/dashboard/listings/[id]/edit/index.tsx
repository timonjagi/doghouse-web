import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepSeparator,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { NextSeo } from 'next-seo';
import { useListing, useUpdateListing, useUploadListingPhotos } from '../../../../../hooks/queries/useListings';

// Import step components (reuse from create flow)
import { BasicInfoStep } from '../../create/basic-info';
import { PetDetailsStep } from '../../create/pet-details';
import { MediaStep } from '../../create/media';
import { PricingStep } from '../../create/pricing';
import { ReviewStep } from '../../create/review';
import { useCurrentUser } from 'lib/hooks/queries/useAuth';
import { useUserBreedsFromUser } from 'lib/hooks/queries';
import { ListingFormData } from '../../create';
import { supabase } from 'lib/supabase/client';

interface EditListingPageProps {
  id: string;
}

const EditListingPage: React.FC<EditListingPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: user } = useCurrentUser();
  const { data: userBreeds, isLoading: userBreedsLoading, error } = useUserBreedsFromUser(user?.id);
  const { data: listing, isLoading: listingLoading } = useListing(id as string);
  const bgColor = useColorModeValue('white', 'gray.800');

  const updateListingMutation = useUpdateListing();
  const uploadPhotosMutation = useUploadListingPhotos({ userId: user?.id || '' });

  const steps = [
    { title: 'Basic Info', description: 'Title and type' },
    { title: 'Pet Details', description: 'Specific information' },
    { title: 'Photos', description: 'Images and media' },
    { title: 'Pricing', description: 'Price and location' },
    { title: 'Review', description: 'Final review' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    type: 'litter',
    photos: [],
    owner_type: 'breeder'
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load existing listing data when component mounts
  useEffect(() => {

    if (listing && user) {
      // Check if user owns this listing
      if (listing.owner_id !== user?.id) {
        router.push('/dashboard/listings');
        return;
      }
      // Pre-populate form with existing data
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        type: listing.type as 'litter' | 'single_pet',
        owner_type: listing.owner_type as 'breeder' | 'seeker',
        user_breed_id: listing.user_breed_id,
        breed_id: listing.breed_id,
        birth_date: listing.birth_date ? listing.birth_date.split('T')[0] : '',
        available_date: listing.available_date ? listing.available_date.split('T')[0] : '',
        number_of_puppies: listing.number_of_puppies,
        pet_name: listing.pet_name,
        pet_age: listing.pet_age,
        pet_gender: listing.pet_gender,
        price: listing.price,
        reservation_fee: listing.reservation_fee,
        location_text: listing.location_text,
        photos: listing.photos || [],
      });
      setIsLoading(false);
    }
  }, [listing, user, router]);

  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {

      const photoUrls = await uploadPhotosMutation.mutateAsync({
        listingId: id as string,
        files: formData.photos,
      });


      const retainedPhotos = formData.photos.filter((file) => !(file instanceof File)) as string[] || [];
      console.log('retainedPhotos', retainedPhotos);


      const deletedPhotos = listing.photos?.filter((photo) => !retainedPhotos.includes(photo)) || [];
      console.log('deletedPhotos', deletedPhotos);

      if (deletedPhotos.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('listing-images')
          .remove(deletedPhotos as string[]);

        if (deleteError) throw deleteError;
      }

      const updatedPhotos = [...(listing.photos?.filter((photo) => !deletedPhotos.includes(photo)) || []), ...photoUrls];
      console.log('updatedPhotos', updatedPhotos);

      // Update the listing
      const updateData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        user_breed_id: formData.user_breed_id,
        breed_id: formData.breed_id,
        ...(formData.type === 'litter' && { birth_date: formData.birth_date }),
        ...(formData.type === 'litter' && { available_date: formData.available_date }),
        ...(formData.type === 'litter' && { number_of_puppies: formData.number_of_puppies }),
        ...(formData.type === 'single_pet' && { pet_name: formData.pet_name }),
        ...(formData.type === 'single_pet' && { pet_age: formData.pet_age }),
        ...(formData.type === 'single_pet' && { pet_gender: formData.pet_gender }),
        price: formData.price,
        reservation_fee: formData.reservation_fee,
        location_text: formData.location_text,
        photos: updatedPhotos
      };

      await updateListingMutation.mutateAsync({
        id: id as string,
        updates: updateData,
      });

      router.push(`/dashboard/listings/${id}`);
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const canProceedToNext = () => {
    switch (activeStep) {
      case 0: // Basic Info
        return formData.title.trim() !== '' && !!formData.type;
      case 1: // Pet Details
        if (formData.type === 'litter') {
          return !!(formData.birth_date && formData.available_date && formData.number_of_puppies);
        } else {
          return !!(formData.pet_name && formData.pet_age && formData.pet_gender);
        }
      case 2: // Photos (optional for editing)
        return true;
      case 3: // Pricing
        return formData.price !== undefined && !!formData.location_text;
      default:
        return true;
    }
  };

  if (listingLoading || isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!listing) {
    return (
      <Container maxW="4xl" py={8}>
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Listing not found</Text>
            <Button onClick={() => router.push('/dashboard/listings')}>
              Back to Listings
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (user?.id !== listing.owner_id) {
    return (
      <Container maxW="4xl" py={8}>
        <Center h="400px">
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">Access denied</Text>
            <Text color="gray.400">You can only edit your own listings</Text>
            <Button onClick={() => router.push('/dashboard/listings')}>
              Back to Listings
            </Button>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <>
      <NextSeo title={`Edit ${listing.title} - DogHouse Kenya`} />

      <Container maxW="4xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.push(`/dashboard/listings/${id}`)}
              mb={4}
            >
              Back to Listing
            </Button>
            <Heading size="lg" mb={2}>Edit Listing</Heading>
            <Text color="gray.600">Update your listing information and photos</Text>
          </Box>

          <Card bg={bgColor}>
            <CardBody>
              <VStack spacing={8} align="stretch">
                <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand">
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus complete={<StepIcon />} />
                      </StepIndicator>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>

                <Box minH="400px">
                  {activeStep === 0 && (
                    <BasicInfoStep
                      data={formData}
                      updateData={updateFormData}
                      userBreeds={userBreeds}
                    />
                  )}

                  {activeStep === 1 && (
                    <PetDetailsStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 2 && (
                    <MediaStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 3 && (
                    <PricingStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 4 && (
                    <ReviewStep
                      data={formData}
                      onSubmit={handleSubmit}
                      isEditing={true}
                      loading={updateListingMutation.isPending || uploadPhotosMutation.isPending}
                    />
                  )}
                </Box>

                <HStack justify="space-between" pt={4}>
                  <Button
                    leftIcon={<ArrowBackIcon />}
                    onClick={handlePrevious}
                    isDisabled={activeStep === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>

                  {activeStep < steps.length - 1 ? (
                    <Button
                      rightIcon={<ArrowForwardIcon />}
                      colorScheme="brand"
                      onClick={handleNext}
                      isDisabled={!canProceedToNext()}
                    >
                      Next
                    </Button>
                  ) : null}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </>
  );
};

export default EditListingPage;
