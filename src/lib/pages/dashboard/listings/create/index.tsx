import React, { useEffect, useState } from 'react';
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
  Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
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
import ParentInfoStep from './parent-info';
import HealthInfoStep from './health-info';
import RequirementsStep from './requirements';

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
  photos: File[] | string[];

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
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const uploadPhotosMutation = useUploadListingPhotos({ userId: user?.id || '' });

  const createListingMutation = useCreateListing();
  const updateListingMutation = useUpdateListing();

  const steps = [
    { title: 'Basic Info', description: 'Title and type' },
    { title: 'Pet Details', description: 'Specific information' },
    { title: 'Parent Information', description: 'Sire and Dam details' },
    { title: 'Health Information', description: 'Health details' },
    { title: 'Photos', description: 'Images and media' },
    { title: 'Pricing', description: 'Price and location' },
    { title: 'Requirements', description: 'Adoption requirements' },
    { title: 'Review & Submit', description: 'Finalize your listing' },
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
    health: { vaccinations: [], healthTests: {}, certificates: [], medicalNotes: '' },
    training: {},
    requirements: {},
    parents: {
      sire: { name: '', breed: '', photos: [] },
      dam: { name: '', breed: '', photos: [] },
    },
    tags: [],
  });

  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    localStorage.setItem('listingFormData', JSON.stringify({ ...formData, ...updates }));
  };

  useEffect(() => {
    const savedData = localStorage.getItem('listingFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('Loaded saved listing form data:', JSON.parse(savedData));
      setFormData({
        ...formData,
        ...parsedData,
        photos: [],
        parents: {
          sire: {
            ...parsedData.parents.sire,
            photos: []
          },
          dam: {
            ...parsedData.parents.dam,
            photos: []
          }
        },
        health: {
          ...parsedData.health,
          certificates: [],
        },
        training: {
          ...parsedData.training,
        }
      });

    }
  }, []);

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
        parents: {
          sire: {
            name: data.parents?.sire?.name,
            breed: data.parents?.sire?.breed,
          },
          dam: {
            name: data.parents?.dam?.name,
            breed: data.parents?.dam?.breed,
          },
        },
        health: {
          vaccinations: data.health?.vaccinations,
          healthTests: data.health?.healthTests,
          medicalNotes: data.health?.medicalNotes
        },
        training: data.training,
        requirements: data.requirements,
        tags: data.tags,
        price: data.price,
        reservation_fee: data.reservation_fee,
        location_text: data.location_text,
        status: 'pending' as const,
      };

      const result = await createListingMutation.mutateAsync(listingData);

      let filesToUpload: File[] = [];
      // If photos exist, upload them
      if (data.photos && data.photos.length > 0 && result.id) {
        // Filter to only File objects for upload
        filesToUpload = data.photos.filter((photo): photo is File => photo instanceof File);
      };

      let sirePhotoFiles: File[] = [];
      // Also upload parent photos if any
      if (data.parents?.sire?.photos && data.parents.sire.photos.length > 0) {
        sirePhotoFiles = data.parents.sire.photos.filter((photo): photo is File => photo instanceof File);
      }

      let damPhotoFiles: File[] = [];
      if (data.parents?.dam?.photos && data.parents.dam.photos.length > 0) {
        damPhotoFiles = data.parents.dam.photos.filter((photo): photo is File => photo instanceof File);
      }

      // upload certificates if any
      let certFiles: File[] = [];
      if (data.health?.certificates && data.health.certificates.length > 0) {
        certFiles = data.health.certificates.filter((file): file is File => file instanceof File);
      }
      // upload files using separate calls to upload moutation in a promise.all to get urls and update respective lisiting fields afterwards
      const { photoUrls, sirePhotoUrls, damPhotoUrls, certUrls } = await Promise.all([
        uploadPhotosMutation.mutateAsync({
          listingId: result.id,
          files: filesToUpload
        }),
        uploadPhotosMutation.mutateAsync({
          listingId: result.id,
          files: sirePhotoFiles
        }),
        uploadPhotosMutation.mutateAsync({
          listingId: result.id,
          files: damPhotoFiles
        }),
        uploadPhotosMutation.mutateAsync({
          listingId: result.id,
          files: certFiles
        }),
      ]).then(([photoUrls, sirePhotoUrls, damPhotoUrls, certUrls]) => ({ photoUrls, sirePhotoUrls, damPhotoUrls, certUrls }));
      // Update listing with photo URLs
      await updateListingMutation.mutateAsync({
        id: result.id,
        updates: {
          photos: photoUrls,
          parents: {
            sire: {
              ...listingData.parents.sire,
              photos: sirePhotoUrls,
            },
            dam: {
              ...listingData.parents.dam,
              photos: damPhotoUrls,
            }
          },
          health: {
            ...listingData.health,
            certificates: certUrls,
          },
        },
      });

      toast({
        title: "Success",
        description: `Listing created successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.removeItem('listingFormData');

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
        parents: {
          sire: {
            name: '',
            breed: '',
            photos: [],
          },
          dam: {
            name: '',
            breed: '',
            photos: [],
          },
        },
        health: {
          vaccinations: [],
          healthTests: {},
          medicalNotes: '',
          certificates: [],
        },
        training: undefined,
        requirements: undefined
      });
    }
  };

  const canProceedToNext = () => {
    switch (activeStep) {
      case 0: // Basic Info
        return !!formData.user_breed_id && !!formData.type;
      case 1: // Pet Details
        if (formData.type === 'litter') {
          return !!(formData.birth_date && formData.available_date && formData.number_of_puppies);
        } else {
          return !!(formData.pet_name && formData.pet_age && formData.pet_gender);
        }

      case 2: // Parent Information
        return !!formData.parents.sire.name && !!formData.parents.sire.breed && !!formData.parents.dam.name && !!formData.parents.dam.breed;
      case 3: // Photos
        return formData.photos.length > 0;
      case 4: // Health Information
        return true; // No required fields
      case 5: // Pricing
        return formData.price !== undefined
      case 6: // Requirements
        return true; // No required fields
      default:
        return true;
    }
  };


  if (userBreedsLoading) {
    return (
      <Loader />
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
                    />
                  )}

                  {activeStep === 1 && (
                    <PetDetailsStep
                      data={formData}
                      updateData={updateFormData}
                      userBreeds={userBreeds}
                    />
                  )}



                  {activeStep === 2 && (
                    <ParentInfoStep
                      data={formData}
                      updateData={updateFormData}
                      userBreeds={userBreeds}
                    />
                  )}

                  {activeStep === 3 && (
                    <MediaStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 4 && (
                    <HealthInfoStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 5 && (
                    <PricingStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 6 && (
                    <RequirementsStep
                      data={formData}
                      updateData={updateFormData}
                    />
                  )}

                  {activeStep === 7 && (
                    <ReviewStep
                      data={formData}
                      userBreeds={userBreeds}
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

                  {activeStep === steps.length - 1 && <Button
                    leftIcon={isLoading ? <Spinner size="sm" /> : <CheckIcon />}
                    colorScheme="brand"
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={createListingMutation.isPending || uploadPhotosMutation.isPending}
                    loadingText={"Publishing..."}
                  >
                    Publish Listing
                  </Button>}
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
