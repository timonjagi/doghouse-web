import {
  Stack,
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
} from "@chakra-ui/react";
import React, { use, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useCurrentUser, useUpdateUserBreed, useUpdateUserProfile, useUserBreedsFromUser } from "../../../hooks/queries";
import { useDropZone } from "../../../hooks/useDropZone";
import { useBreedImageUpload } from "../../../hooks/useBreedImageUpload";
import { Dropzone } from "../../../components/ui/Dropzone";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreedImages: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const updateUserProfile = useUpdateUserProfile();
  const toast = useToast();

  // Fetch user's breeds from database
  const { data: userBreeds, isLoading: userBreedsLoading } = useUserBreedsFromUser(user?.id || '');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

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

      // Update the user_breed record with image URLs
      if (userBreeds && userBreeds.length > 0) {
        const userBreed = userBreeds[0]; // Most recently created breed
        await updateUserBreed.mutateAsync({
          id: userBreed.id,
          updates: { images: urls }
        });
      }
    }
  });

  const updateUserBreed = useUpdateUserBreed();

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

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Upload breed images if any selected
      if (selectedImages.length > 0) {
        const uploadedUrls = await uploadImages(selectedImages);

        const selectedUserBreed = userBreeds?.[0]
        if (uploadedUrls.length > 0 && selectedUserBreed?.id) {
          await updateUserBreed.mutateAsync({
            id: selectedUserBreed.id,
            updates: { images: uploadedUrls }
          });
        }

        // Mark onboarding as complete
        await updateUserProfile.mutateAsync({
          onboarding_completed: true,
        });

        toast({
          title: "Images uploaded successfully!",
          description: "Your breed photos have been saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Advance to success step instead of closing
        setStep(currentStep + 1);
      }

    } catch (error: any) {
      toast({
        title: "Error completing setup",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Show loading spinner while fetching breeds
  if (userBreedsLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }


  return (
    <Stack as="form" spacing="8" onSubmit={onSubmit}>
      <VStack spacing={6} textAlign="center">
        <Icon as={MdCheckCircle} boxSize={16} color="green.500" />
        <Heading size="md">
          Almost done! 📸
        </Heading>

        <Text fontSize="lg" color="gray.600">
          Upload up to 5 photos of your breed
        </Text>

        {/* Use the existing Dropzone component */}
        <Box w="full">
          <Dropzone
            selectedFiles={imageUrls}
            onChange={handleImageSelect}
            onRemove={(fileUrl) => {
              // Find the index of the file that matches this URL
              const index = selectedImages.findIndex(file => URL.createObjectURL(file) === fileUrl);
              if (index !== -1) {
                handleRemoveImage(index);
              }
            }}
            maxUploads={5}
          />
        </Box>
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
          disabled={selectedImages.length === 0 || loading || uploading}
        >
          Complete Setup
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
