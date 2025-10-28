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
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
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
import HealthInfoStep from '../../create/health-info';
import RequirementsStep from '../../create/requirements';
import ParentInfoStep from '../../create/parent-info';
import { Loader } from 'lib/components/ui/Loader';

interface EditListingPageProps {
  id: string;
}

const EditListingPage: React.FC<EditListingPageProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  const { data: user } = useCurrentUser();
  const { data: userBreeds, isLoading: userBreedsLoading, error } = useUserBreedsFromUser(user?.id);
  const { data: listing, isLoading: listingLoading } = useListing(id as string);
  const bgColor = useColorModeValue('white', 'gray.800');

  const updateListingMutation = useUpdateListing();
  const uploadPhotosMutation = useUploadListingPhotos({ userId: user?.id || '' });

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
    title: listing.title || '',
    description: listing.description || '',
    type: listing.type as 'litter' | 'single_pet',
    owner_type: listing.owner_type as 'breeder' | 'seeker',
    user_breed_id: listing.user_breed_id,
    breed_id: listing.breed_id,
    birth_date: listing.birth_date ? listing.birth_date.toString().split('T')[0] : '',
    available_date: listing.available_date ? listing.available_date.toString().split('T')[0] : '',
    number_of_puppies: listing.number_of_puppies,
    pet_name: listing.pet_name,
    pet_age: listing.pet_age,
    pet_gender: listing.pet_gender,
    price: parseInt(listing.price),
    reservation_fee: parseInt(listing.reservation_fee),
    location_text: listing.location_text,
    location_lat: parseFloat(listing.location_lat),
    location_lng: parseFloat(listing.location_lng),
    //@ts-ignore
    photos: listing.photos,
    parents: listing.parents || {},
    health: listing.health ?? {},
    training: listing.training || {},
    requirements: listing.requirements || {},
  })

  const [isLoading, setIsLoading] = useState(true);

  // Load existing listing data when component mounts
  useEffect(() => {

    if (listing && user) {
      // Check if user owns this listing
      if (listing.owner_id !== user?.id) {
        router.push('/dashboard/listings');
        return;
      }

      const savedData = localStorage.getItem('listingFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData({
          ...formData,
          ...parsedData,
          photos: formData.photos || [],
          parents: {
            sire: {
              ...formData.parents?.sire,
              ...parsedData.parents?.sire,
              photos: formData.parents?.sire?.photos || []
            },
            dam: {
              ...formData.parents?.dam,
              ...parsedData.parents.dam,
              photos: formData.parents?.dam?.photos || []
            }
          },
          health: {
            ...formData.health,
            ...parsedData.health,
            certificates: formData.health?.certificates || []
          },
        });

      }

      console.log('listing', listing);
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

      setIsLoading(true);

      let filesToUpload: File[] = [];
      // If photos exist, upload them
      if (formData.photos && formData.photos.length > 0) {
        // Filter to only File objects for upload
        filesToUpload = formData.photos.filter((photo) => photo instanceof File);
      };

      let photoUrls = []
      if (filesToUpload.length > 0) {
        photoUrls = await uploadPhotosMutation.mutateAsync({
          listingId: id as string,
          files: filesToUpload
        });
      }

      let sirePhotoFiles: File[] = [];
      if (formData.parents?.sire?.photos && formData.parents.sire.photos.length > 0) {
        sirePhotoFiles = formData.parents.sire.photos.filter((photo) => photo instanceof File);
      }

      let sirePhotoUrls = []
      if (sirePhotoFiles.length > 0) {
        await uploadPhotosMutation.mutateAsync({
          listingId: id as string,
          files: sirePhotoFiles
        });
      }

      let damPhotoFiles: File[] = [];
      if (formData.parents?.dam?.photos && formData.parents.dam.photos.length > 0) {
        damPhotoFiles = formData.parents.dam.photos.filter((photo) => photo instanceof File);
      }

      let damPhotoUrls = [];
      if (damPhotoFiles.length > 0) {
        await uploadPhotosMutation.mutateAsync({
          listingId: id as string,
          files: damPhotoFiles
        });
      }

      let certFiles: File[] = [];
      if (formData.health?.certificates && formData.health.certificates.length > 0) {
        certFiles = formData.health.certificates.filter((file) => file instanceof File);
      }

      let certUrls = []
      if (certFiles.length > 0) {
        certUrls = await uploadPhotosMutation.mutateAsync({
          listingId: id as string,
          files: certFiles
        });
      }


      const retainedPhotos = [...formData.photos].filter((file) => !(file instanceof File)) as string[] || [];

      const retainedSirePhotos = [...formData.parents?.sire?.photos].filter((file) => !(file instanceof File)) as string[] || [];

      const retainedDamPhotos = [...formData.parents?.dam?.photos].filter((file) => !(file instanceof File)) as string[] || [];

      const retainedCerts = [...formData.health?.certificates].filter((file) => !(file instanceof File)) as string[] || [];

      const deletedPhotos = Array.from(listing.photos as string[] || [])?.filter((photo) => !retainedPhotos.includes(photo)) || [];
      console.log('deletedPhotos', deletedPhotos);

      //@ts-ignore
      const deletedSirePhotos = Array.from(listing.parents?.sire?.photos as string[] || [])?.filter((photo) => !retainedSirePhotos.includes(photo)) || [];
      console.log('deletedParentPhotos', deletedSirePhotos);

      //@ts-ignore
      const deletedDamPhotos = Array.from(listing.parents?.dam?.photos as string[] || [])?.filter((photo) => !retainedDamPhotos.includes(photo)) || [];
      console.log('deletedDamPhotos', deletedDamPhotos);

      //@ts-ignore
      const deletedCerts = Array.from(listing.health?.certificates as string[] || [])?.filter((photo) => !retainedCerts.includes(photo)) || [];
      console.log('deletedCerts', deletedCerts);

      if (deletedPhotos.length > 0 || deletedSirePhotos.length > 0 || deletedDamPhotos.length > 0 || deletedCerts.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('listing-images')
          .remove([...deletedPhotos as string[], ...deletedSirePhotos as string[], ...deletedDamPhotos as string[], ...deletedCerts as string[]]);

        if (deleteError) throw deleteError;
      }

      const updatedPhotos = [...(Array.from(listing.photos as string[] || [])?.filter((photo) => !deletedPhotos.includes(photo)) || []), ...photoUrls];
      console.log('updatedPhotos', updatedPhotos);

      //@ts-ignore
      const updatedSirePhotos = [...(Array.from(listing.parents?.sire.photos as string[] || [])?.filter((photo) => !deletedSirePhotos.includes(photo)) || []), ...sirePhotoUrls];
      console.log('updatedSirePhotos', updatedSirePhotos);

      //@ts-ignore
      const updatedDamPhotos = [...(Array.from(listing.parents?.dam.photos as string[] || [])?.filter((photo) => !deletedDamPhotos.includes(photo)) || []), ...damPhotoUrls];
      console.log('updatedDamPhotos', updatedDamPhotos);

      //@ts-ignore
      const updatedCerts = [...(Array.from(listing.health?.certificates as string[] || [])?.filter((photo) => !deletedCerts.includes(photo)) || []), ...certUrls];
      console.log('updatedCerts', updatedCerts);

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
        photos: updatedPhotos,
        parents: {
          sire: {
            name: formData.parents.sire.name,
            breed: formData.parents.sire.breed,
            photos: updatedSirePhotos,
          },
          dam: {
            name: formData.parents.dam.name,
            breed: formData.parents.dam.breed,
            photos: updatedDamPhotos,
          },
        },
        health: {
          ...formData.health,
          certificates: updatedCerts,
        },
        requirements: formData.requirements,
        training: formData.training
      };

      await updateListingMutation.mutateAsync({
        id: id as string,
        updates: updateData,
      });

      setIsLoading(false);
      localStorage.removeItem('listingFormData');
      router.push(`/dashboard/listings/${id}`);

      toast({
        title: "Success",
        description: `Listing updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to save listing. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // updateFormData({
      //   title: '',
      //   description: '',
      //   type: 'litter',
      //   photos: [],
      //   birth_date: undefined,
      //   available_date: undefined,
      //   number_of_puppies: undefined,
      //   pet_name: undefined,
      //   pet_age: undefined,
      //   pet_gender: undefined,
      //   price: undefined,
      //   reservation_fee: undefined,
      //   location_text: undefined,
      //   location_lat: undefined,
      //   location_lng: undefined,
      //   tags: [],
      //   parents: {
      //     sire: {
      //       name: '',
      //       breed: '',
      //       photos: [],
      //     },
      //     dam: {
      //       name: '',
      //       breed: '',
      //       photos: [],
      //     },
      //   },
      //   health: {
      //     vaccinations: [],
      //     healthTests: {},
      //     medicalNotes: '',
      //     certificates: [],
      //   },
      //   training: undefined,
      //   requirements: undefined
      // });
      setIsLoading(false);

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
        return true;
      case 3: // Photos
        return formData.photos?.length > 0;
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

  if (listingLoading || userBreedsLoading) {
    return (
      <Loader />
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

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading breed data. Please try again later.
        {error.message}
      </Alert>
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

      <Container maxW="4xl" py={4}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => router.push(`/dashboard/listings/${id}`)}
              mb={4}
              p={0}
            >
              Back to Listing
            </Button>
            <Heading size={{ base: 'sm', lg: 'md' }} mb={2}>Edit Listing</Heading>
            <Text color="gray.600">Update your listing information and photos</Text>
          </Box>

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

            <HStack justify="space-between" >
              <Button
                leftIcon={<ArrowBackIcon />}
                onClick={handlePrevious}
                isDisabled={activeStep === 0}
                variant="ghost"
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
                isLoading={isLoading}
                loadingText={"Publishing..."}
              >
                Update Listing
              </Button>}
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </>
  );
};

export default EditListingPage;
