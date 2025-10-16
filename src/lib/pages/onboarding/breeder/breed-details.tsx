import {
  Stack,
  FormControl,
  FormLabel,
  Text,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Heading,
  VStack,
  Icon,
  Box,
  Center,
  Spinner,
  Badge,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useCreateUserBreed, useCurrentUser, useDeleteUserBreed, useUpdateUserBreed, useUpdateUserProfile, useUserBreedsFromUser } from "../../../hooks/queries";
import breedsData from "../../../data/breeds_with_group_and_traits.json";
import { useDropZone } from "../../../hooks/useDropZone";
import { useBreedImageUpload } from "../../../hooks/useBreedImageUpload";
import { Dropzone } from "../../../components/ui/Dropzone";
import { supabase } from "../../../supabase/client";
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";
import { Select } from "chakra-react-select";
import { Loader } from "lib/components/ui/Loader";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreederBreedDetails: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const { data: userBreeds, isLoading: userBreedsLoading } = useUserBreedsFromUser(user?.id);
  const { mutateAsync: createUserBreed } = useCreateUserBreed();
  const { mutateAsync: updateUserBreed } = useUpdateUserBreed();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile();

  const toast = useToast();

  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Use local breeds data for better performance
  const breedOptions = breedsData.map((breed) => ({
    label: breed.name,
    value: breed.name, // Use name as value for selection
    breed: breed,
  }));

  const onSelectBreed = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedBreed(selectedOption.breed);
    } else {
      setSelectedBreed(null);
    }
  };
  // Use the reusable hooks
  const { onSelectImage, onRemoveImage, isMaxFiles } = useDropZone({
    selectedImages,
    setSelectedImages,
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const { uploadImages, uploading } = useBreedImageUpload({
    userId: user?.id || '',

    onUploadComplete: async (urls) => {
      console.log('Images uploaded successfully:', urls);
    }
  });

  // Convert File objects to URLs for Dropzone component
  const imageUrls = selectedImages.map(file => URL.createObjectURL(file));

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectImage(event);
  };

  const handleRemoveImage = (index: number) => {
    onRemoveImage(index);
  };

  const onBack = () => {
    setStep(currentStep - 1);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !selectedBreed) {
      toast({
        title: "Selection required",
        description: "Please select a breed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Image selection required",
        description: "Please select at least one image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // First find the breed in the database by name
      const { data: dbBreed, error: findError } = await supabase
        .from('breeds')
        .select('id')
        .eq('name', selectedBreed.name)
        .single();

      if (findError) throw new Error(`Breed not found: ${selectedBreed.name}`);

      // Create the user_breed record with the database ID
      const newUserBreed = await createUserBreed({
        breed_id: dbBreed.id,
        is_owner: true
      });

      const uploadedUrls = await uploadImages(selectedImages);

      if (uploadedUrls.length > 0 && newUserBreed?.id) {
        await updateUserBreed({
          id: newUserBreed.id,
          updates: { images: uploadedUrls }
        });
      }
      await updateUserProfile({
        onboarding_completed: true,
      });

      toast({
        title: "Breed details saved successfully!",
        description: "Your breed information has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setStep(currentStep + 1);
    } catch (error: any) {
      toast({
        title: "Error saving breed details",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };


  return (
    <>
      {userBreedsLoading && <Center h="100%" flex="1" position="absolute" bg="white">
        <Loader />
      </Center>
      }
      <Stack as="form" spacing="8" onSubmit={onSubmit}>
        <VStack spacing={6} textAlign="center">
          <Heading size={{ base: "sm", lg: "md" }}>
            Tell us about your primary breed
          </Heading>

          <Stack spacing={4} w="full">
            <FormControl>
              <FormLabel htmlFor="breed" fontWeight="semibold">
                Primary Breed
              </FormLabel>
              <Select
                placeholder="Select breed..."
                colorScheme="brand"
                options={breedOptions}
                value={selectedBreed ? { label: selectedBreed.name, value: selectedBreed.id } : null}
                onChange={onSelectBreed}
              />
            </FormControl>

            <Box>
              <FormLabel fontWeight="semibold" mb={4}>
                Breed Photos
              </FormLabel>
              <Text color="subtle" mb={4} fontSize="xs">
                Upload up to 4 photos of your breed
              </Text>

              <Dropzone
                selectedFiles={imageUrls}
                onChange={handleImageSelect}
                onRemove={(fileUrl) => {
                  const index = selectedImages.findIndex(file => URL.createObjectURL(file) === fileUrl);
                  if (index !== -1) {
                    handleRemoveImage(index);
                  }
                }}
                maxUploads={4}
              />
            </Box>
          </Stack>

          <HStack justify="start">
            <Icon as={BsInfoCircle} color="subtle" size="sm"></Icon>
            <Text fontSize="xs" color="subtle">You can add more breeds later from your dashboard.</Text>
          </HStack>
        </VStack>

        <ButtonGroup width="100%">
          <Button onClick={onBack} variant="ghost">
            Back
          </Button>
          <Spacer />
          <Button
            isLoading={loading || uploading}
            type="submit"
            variant="primary"
            isDisabled={loading || uploading || userBreedsLoading}
          >
            Complete Setup
          </Button>
        </ButtonGroup>
      </Stack>
    </>

  );
};
