import React, { useState } from 'react';
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
  Alert,
  AlertIcon,
  Center,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { NextSeo } from 'next-seo';

// Import step components (we'll create these next)
import { BasicInfoStep } from './basic-info';
import { PetDetailsStep } from './pet-details';
import { MediaStep } from './media';
import { PricingStep } from './pricing';
import { ReviewStep } from './review';

import { useCreateListing, useUpdateListing, useUploadListingPhotos } from '../../../../hooks/queries/useListings';
import { Loader } from 'lib/components/ui/Loader';
import { useCurrentUser, useUserBreedsFromUser } from 'lib/hooks/queries';

export interface ListingFormData {
  // Basic Info
  title: string;
  description: string;
  type: 'litter' | 'single_pet';
  breed_id?: string;
  user_breed_id?: string;
  owner_type?: 'breeder' | 'seeker';

  // Pet Details (conditional based on type)
  birth_date?: string;
  available_date?: string;
  number_of_puppies?: number;
  pet_name?: string;
  pet_age?: string;
  pet_gender?: string;

  // Media
  photos: (File | string)[];

  // Pricing & Location
  price?: number;
  reservation_fee?: number;
  location_text?: string;
  location_lat?: number;
  location_lng?: number;

  // 🆕 Enhanced Information
  parents?: {
    sire?: {
      name: string;
      breed: string;
      registration?: string;
      photos: File[];
    };
    dam?: {
      name: string;
      breed: string;
      registration?: string;
      photos: File[];
    };
  };

  health?: {
    vaccinations?: Array<{
      type: string;
      date: string;
      completed: boolean;
    }>;
    healthTests?: {
      dna?: boolean;
      hips?: boolean;
      eyes?: boolean;
      heart?: boolean;
    };
    certificates?: File[];
    medicalNotes?: string;
  };

  training?: {
    houseTrained?: boolean;
    crateTrained?: boolean;
    basicCommands?: boolean;
    additionalTraining?: string;
  };

  requirements?: {
    application?: boolean;
    contract?: boolean;
    spayNeuter?: boolean;
    returnPolicy?: boolean;
    homeCheck?: boolean;
    references?: boolean;
    experience?: boolean;
    yard?: boolean;
    fence?: boolean;
    otherPets?: 'allowed' | 'no-dogs' | 'no-cats' | 'none';
    children?: 'allowed' | 'no-young-children' | 'none';
  };

  // Additional
  tags?: string[];
}

const CreateListingPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: user } = useCurrentUser();
  const { data: userBreeds, isLoading: userBreedsLoading, error } = useUserBreedsFromUser(user?.id);

  const bgColor = useColorModeValue('white', 'gray.800');
  const uploadPhotosMutation = useUploadListingPhotos({ userId: user?.id || '' });

  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();

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
    owner_type: 'breeder',
  });

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
    // TODO: Implement listing creation
    console.log('Creating listing:', formData);

    const data = formData;
    try {
      // First, create the listing without photos
      const listingData = {
        title: data.title,
        description: data.description,
        type: data.type,
        owner_type: data.owner_type,
        user_breed_id: data.user_breed_id,
        breed_id: userBreeds.find(breed => breed.id === data.user_breed_id)?.breed_id,
        ...(data.type === 'litter' && { birth_date: data.birth_date }),
        ...(data.type === 'litter' && { available_date: data.available_date }),
        ...(data.type === 'litter' && { number_of_puppies: data.number_of_puppies }),
        ...(data.type === 'single_pet' && { pet_name: data.pet_name }),
        ...(data.type === 'single_pet' && { pet_age: data.pet_age }),
        ...(data.type === 'single_pet' && { pet_gender: data.pet_gender }),
        price: data.price,
        reservation_fee: data.reservation_fee,
        location_text: data.location_text,
        status: 'available' as const,
      };

      const result = await createListingMutation.mutateAsync(listingData);

      // If photos exist, upload them
      if (data.photos && data.photos.length > 0 && result.id) {
        // Filter to only File objects for upload
        const filesToUpload = data.photos.filter((photo): photo is File => photo instanceof File);

        if (filesToUpload.length > 0) {
          const photoUrls = await uploadPhotosMutation.mutateAsync({
            listingId: result.id,
            files: filesToUpload
          });

          await updateListingMutation.mutateAsync({
            id: result.id,
            updates: { photos: photoUrls },
          });
        }
      };


      toast({
        title: "Success",
        description: `Listing created successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard/listings/manage');

    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to save breeds. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      updateFormData({
        title: '',
        description: '',
        type: 'litter',
        photos: [],
        birth_date: undefined,
        available_date: undefined,
        number_of_puppies: undefined,
        pet_name: undefined,
        pet_age: undefined,
        pet_gender: undefined,
        price: undefined,
        reservation_fee: undefined,
        location_text: undefined,
        location_lat: undefined,
        location_lng: undefined,
        tags: [],
      });
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
      case 2: // Photos
        return formData.photos.length > 0;
      case 3: // Pricing
        return formData.price !== undefined && !!formData.location_text;
      default:
        return true;
    }
  };


  if (userBreedsLoading) {
    return (
      <Center height="200px">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breed data. Please try again later.
        {error.message}
      </Alert>
    );
  }

  if (userBreeds?.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        No breeds added yet. Please add a breed first.

        <Button as={Link} href="/dashboard/breeds/manage">Add Breed</Button>
      </Alert>
    );
  }

  return (
    <>
      <NextSeo title="Create Listing - DogHouse Kenya" />

      <Container maxW="4xl" >
        <VStack spacing={8} align="stretch">
          <Box>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.push('/dashboard/listings')}
              mb={4}
              p={0}
            >
              Back to Listings
            </Button>
            <Heading size={{ base: 'sm', lg: 'md' }} mb={2} color="brand.500">Create New Listing</Heading>
            <Text color="gray.600">Share your litter or pet with potential adopters</Text>
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
                      loading={createListingMutation.isPending || uploadPhotosMutation.isPending}
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

export default CreateListingPage;
