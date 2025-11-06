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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { Listing, User, UserBreed } from '../../../../../../db/schema';
import { supabase } from 'lib/supabase/client';

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

interface ListingFormProps {
  isOpen: boolean;
  onClose: () => void;
  userBreeds: UserBreed[];
  userProfile: User;
  isEditing?: boolean,
  listing?: Listing
}

const ListingForm: React.FC<ListingFormProps> = ({
  isOpen,
  onClose,
  userBreeds,
  userProfile,
  isEditing,
  listing
}) => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const uploadPhotosMutation = useUploadListingPhotos({ userId: userProfile?.id || '' });

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

  // const [formData, setFormData] = useState<ListingFormData>({
  //   title: '',
  //   description: '',
  //   type: 'litter',
  //   photos: [],
  //   owner_type: 'breeder',
  //   health: { vaccinations: [], healthTests: {}, certificates: [], medicalNotes: '' },
  //   training: {},
  //   requirements: {},
  //   parents: {
  //     sire: { name: '', breed: '', photos: [] },
  //     dam: { name: '', breed: '', photos: [] },
  //   },
  //   tags: [],
  // });

  const [formData, setFormData] = useState<ListingFormData>({
    title: listing?.title || '',
    description: listing?.description || '',
    type: listing?.type as 'litter' | 'single_pet' || 'litter',
    owner_type: listing?.owner_type as 'breeder' | 'seeker' || 'breeder',
    user_breed_id: listing?.user_breed_id || '',
    breed_id: listing?.breed_id || '',
    birth_date: listing?.birth_date ? listing?.birth_date.toString().split('T')[0] : '',
    available_date: listing?.available_date ? listing?.available_date.toString().split('T')[0] : '',
    number_of_puppies: listing?.number_of_puppies || 0,
    pet_name: listing?.pet_name ?? '',
    pet_age: listing?.pet_age || '',
    pet_gender: listing?.pet_gender || '',
    price: parseInt(listing?.price) || 0,
    reservation_fee: parseInt(listing?.reservation_fee) || 0,
    location_text: listing?.location_text || '',
    location_lat: parseFloat(listing?.location_lat),
    location_lng: parseFloat(listing?.location_lng),
    //@ts-ignore
    photos: listing?.photos || [],
    parents: listing?.parents || {
      sire: { name: '', breed: '', photos: [] },
      dam: { name: '', breed: '', photos: [] },
    },
    health: listing?.health ?? {},
    training: listing?.training || {},
    requirements: listing?.requirements || {},
  })

  console.log('formData', formData);

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

  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    localStorage.setItem('listingFormData', JSON.stringify({ ...formData, ...updates }));
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

  const handlePublish = async () => {
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
        status: 'available' as const,
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

      onClose()
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

  const handleUpdate = async () => {
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
          listingId: listing?.id as string,
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
          listingId: listing?.id as string,
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
          listingId: listing?.id as string,
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
          listingId: listing?.id as string,
          files: certFiles
        });
      }


      const retainedPhotos = [...formData.photos].filter((file) => !(file instanceof File)) as string[] || [];

      const retainedSirePhotos = [...formData.parents?.sire?.photos].filter((file) => !(file instanceof File)) as string[] || [];

      const retainedDamPhotos = [...formData.parents?.dam?.photos].filter((file) => !(file instanceof File)) as string[] || [];

      const retainedCerts = [...formData.health?.certificates].filter((file) => !(file instanceof File)) as string[] || [];

      const deletedPhotos = Array.from(listing?.photos as string[] || [])?.filter((photo) => !retainedPhotos.includes(photo)) || [];
      console.log('deletedPhotos', deletedPhotos);

      //@ts-ignore
      const deletedSirePhotos = Array.from(listing?.parents?.sire?.photos as string[] || [])?.filter((photo) => !retainedSirePhotos.includes(photo)) || [];
      console.log('deletedParentPhotos', deletedSirePhotos);

      //@ts-ignore
      const deletedDamPhotos = Array.from(listing?.parents?.dam?.photos as string[] || [])?.filter((photo) => !retainedDamPhotos.includes(photo)) || [];
      console.log('deletedDamPhotos', deletedDamPhotos);

      //@ts-ignore
      const deletedCerts = Array.from(listing?.health?.certificates as string[] || [])?.filter((photo) => !retainedCerts.includes(photo)) || [];
      console.log('deletedCerts', deletedCerts);

      if (deletedPhotos.length > 0 || deletedSirePhotos.length > 0 || deletedDamPhotos.length > 0 || deletedCerts.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('listing-images')
          .remove([...deletedPhotos as string[], ...deletedSirePhotos as string[], ...deletedDamPhotos as string[], ...deletedCerts as string[]]);

        if (deleteError) throw deleteError;
      }

      const updatedPhotos = [...(Array.from(listing?.photos as string[] || [])?.filter((photo) => !deletedPhotos.includes(photo)) || []), ...photoUrls];
      console.log('updatedPhotos', updatedPhotos);

      //@ts-ignore
      const updatedSirePhotos = [...(Array.from(listing?.parents?.sire.photos as string[] || [])?.filter((photo) => !deletedSirePhotos.includes(photo)) || []), ...sirePhotoUrls];
      console.log('updatedSirePhotos', updatedSirePhotos);

      //@ts-ignore
      const updatedDamPhotos = [...(Array.from(listing?.parents?.dam.photos as string[] || [])?.filter((photo) => !deletedDamPhotos.includes(photo)) || []), ...damPhotoUrls];
      console.log('updatedDamPhotos', updatedDamPhotos);

      //@ts-ignore
      const updatedCerts = [...(Array.from(listing?.health?.certificates as string[] || [])?.filter((photo) => !deletedCerts.includes(photo)) || []), ...certUrls];
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
        id: listing?.id as string,
        updates: updateData,
      });

      setIsLoading(false);
      localStorage.removeItem('listingFormData');
      router.push(`/dashboard/listings/${listing?.id}`);
      onClose();
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
        description: "Failed to save listing?. Please try again.",
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
        return !!formData.type && !!formData.title;
      case 1: // Pet Details
        if (formData.type === 'litter') {
          return !!(formData.user_breed_id && formData.birth_date && formData.available_date && formData.number_of_puppies);
        } else {
          return !!(formData.user_breed_id && formData.pet_name && formData.pet_age && formData.pet_gender);
        }

      case 2: // Parent Information
        return true;
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text size="lg" fontWeight="semibold">
                {isEditing ? 'Edit Listing' : 'Create New Listing'}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
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


            </VStack>
          </ModalBody>

          <ModalFooter>
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
                onClick={isEditing ? handleUpdate : handlePublish}
                isLoading={isLoading}
                loadingText={isEditing ? "Updating..." : "Publishing..."}
                isDisabled={isLoading}
              >
                {isEditing ? 'Update Listing' : 'Publish Listing'}
              </Button>}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListingForm;
