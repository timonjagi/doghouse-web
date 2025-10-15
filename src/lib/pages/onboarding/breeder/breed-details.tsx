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
import { useCurrentUser, useBreeds, useUpdateUserBreed, useUserBreedsFromUser } from "../../../hooks/queries";
import { useDropZone } from "../../../hooks/useDropZone";
import { useBreedImageUpload } from "../../../hooks/useBreedImageUpload";
import { Dropzone } from "../../../components/ui/Dropzone";
import { supabase } from "../../../supabase/client";
import { BsInfoCircle, BsInfoCircleFill } from "react-icons/bs";
import { Select } from "chakra-react-select";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreederBreedDetails: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const { data: breeds, isLoading: breedsLoading } = useBreeds();
  const { data: userBreeds, isLoading: userBreedsLoading } = useUserBreedsFromUser(user?.id || '');
  const toast = useToast();

  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const breedOptions = breeds?.map((breed) => ({
    label: breed.name,
    value: breed.id,
    breed: breed,
  })) || [];

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

  const { mutateAsync: updateUserBreed } = useUpdateUserBreed();

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

    setLoading(true);

    try {
      // First create the user_breed record
      const { data: newUserBreed, error: breedError } = await supabase
        .from('user_breeds')
        .insert([{
          user_id: user.id,
          breed_id: selectedBreed,
          is_owner: true,
        }])
        .select()
        .single();

      if (breedError) throw breedError;

      // Upload breed images if any selected
      if (selectedImages.length > 0) {
        const uploadedUrls = await uploadImages(selectedImages);

        if (uploadedUrls.length > 0 && newUserBreed?.id) {
          await updateUserBreed({
            id: newUserBreed.id,
            updates: { images: uploadedUrls }
          });
        }
      }

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

  // Show loading spinner while fetching breeds
  if (breedsLoading || userBreedsLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
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
          <Text fontSize="xs" color="subtle">If you have multiple breeds, you can add  more later from your dashboard.</Text>
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
          isDisabled={!selectedBreed || loading || uploading}
        >
          Complete Setup
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
