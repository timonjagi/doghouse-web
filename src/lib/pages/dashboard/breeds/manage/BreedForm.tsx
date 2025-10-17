import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  useToast,
  Text,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useCreateUserBreed, useUpdateUserBreed, useDeleteUserBreed } from "../../../../hooks/queries/useUserBreeds";
import { useCurrentUser } from "../../../../hooks/queries/useAuth";
import { useDropZone } from "../../../../hooks/useDropZone";
import { useBreedImageUpload } from "../../../../hooks/useBreedImageUpload";
import { Dropzone } from "../../../../components/ui/Dropzone";
import { supabase } from "lib/supabase/client";
import breedsData from "../../../../data/breeds_with_group_and_traits.json";
import { Select } from "chakra-react-select";

// Local types for now - will fix imports later
interface Breed {
  id: string;
  name: string;
  description?: string;
  breed_group?: string;
  featured_image_url?: string;
}

interface UserBreed {
  id: string;
  breed_id: string;
  is_owner: boolean;
  notes?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  breeds?: Breed;
}

interface BreedFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingBreed?: UserBreed | null;
}

export const BreedForm = ({
  isOpen,
  onClose,
  editingBreed
}: BreedFormProps) => {
  const toast = useToast();
  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [breedImages, setBreedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserBreed = useCreateUserBreed();
  const updateUserBreed = useUpdateUserBreed();

  // Get current user for image upload
  const { data: currentUser } = useCurrentUser();

  const breedOptions = breedsData.map((breed) => ({
    label: breed.name,
    value: breed.name, // Use name as value for selection
    breed: breed,
  }));

  // Image upload hook
  const { uploadImages, uploading } = useBreedImageUpload({
    userId: currentUser?.id || '',
    onUploadComplete: (urls) => {
      console.log('Images uploaded successfully:', urls);
    }
  });

  // Dropzone hook for file selection
  const { onSelectImage, onRemoveImage, selectedImages } = useDropZone({
    selectedImages: breedImages,
    setSelectedImages: setBreedImages,
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const imageUrls = selectedImages.map(file => URL.createObjectURL(file));

  const onSelectBreed = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedBreed(selectedOption.breed);
    } else {
      setSelectedBreed(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedBreed) {
      toast({
        title: "No breeds selected",
        description: "Please select at least one breed to continue.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: dbBreed, error: findError } = await supabase
        .from('breeds')
        .select('id')
        .eq('name', selectedBreed.name)
        .single();

      if (findError) throw new Error(`Breed not found: ${selectedBreed.name}`);

      // Create new breed association
      const newUserBreed = await createUserBreed.mutateAsync({
        breed_id: dbBreed.id,
        is_owner: true
      });

      const uploadedUrls = await uploadImages(selectedImages);

      if (uploadedUrls.length > 0 && newUserBreed?.id) {
        await updateUserBreed.mutateAsync({
          id: newUserBreed.id,
          updates: { images: uploadedUrls }
        });
      }

      toast({
        title: "Success",
        description: `Breed ${editingBreed ? 'updated' : 'added'} successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save breeds. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Add Breed
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Text color="gray.600">
              Select breed you offer and add photos
            </Text>

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
                onChange={onSelectImage}
                onRemove={onRemoveImage}
                maxUploads={4}
              />
            </Box>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>

            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Add Breed
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
