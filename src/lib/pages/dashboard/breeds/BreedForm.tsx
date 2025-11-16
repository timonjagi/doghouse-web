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
import { useCreateUserBreed, useUpdateUserBreed, useDeleteUserBreed, useBreedImageUpload } from "../../../hooks/queries/useUserBreeds";
import { useCurrentUser } from "../../../hooks/queries/useAuth";
import { useDropZone } from "../../../hooks/useDropZone";
import { Dropzone } from "../../../components/ui/Dropzone";
import { supabase } from "lib/supabase/client";
import breedsData from "../../../data/breeds_with_group_and_traits.json";
import { Select } from "chakra-react-select";
import { UserBreed } from "../../../../../db/schema";

interface BreedFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingBreed?: any | null;
}

export const BreedForm = ({
  isOpen,
  onClose,
  editingBreed
}: BreedFormProps) => {
  const toast = useToast();
  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [breedImages, setBreedImages] = useState<File[] | string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserBreed = useCreateUserBreed();
  const updateUserBreed = useUpdateUserBreed();

  useEffect(() => {
    if (editingBreed) {
      const breed = breedsData.find((breed) => breed.name === editingBreed.breeds?.name);

      if (breed) {
        setSelectedBreed(breed);
      }

      setBreedImages(editingBreed.images as string[] || []);

    }
  }, [editingBreed]);
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
    breedId: selectedBreed?.id || '',
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

      const uploadedUrls = await uploadImages(selectedImages as File[]);

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

  const handleUpdate = async () => {
    setIsSubmitting(true);


    const retainedPhotos = selectedImages.filter((image) => typeof image === 'string');

    console.log('retained', retainedPhotos);

    const deletedPhotos = editingBreed.images.filter((image: string) => {
      !retainedPhotos.includes(image)
    });

    const newPhotos = selectedImages.filter((image) => image instanceof File);


    try {
      let uploadedUrls = [];
      if (newPhotos.length > 0) {
        uploadedUrls = await uploadImages(newPhotos as File[]);
      }

      if (deletedPhotos.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('breed-images')
          .remove(deletedPhotos);

        if (deleteError) throw new Error(`Failed to delete images: ${deleteError.message}`);
      }

      await updateUserBreed.mutateAsync({
        id: editingBreed.id,
        updates: {
          images: [...retainedPhotos, ...uploadedUrls],
        }
      });

      toast({
        title: "Success",
        description: `Breed updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();


    } catch (error) {
      console.error("Error updating breed:", error);
      toast({
        title: "Error",
        description: "Failed to update breed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false);
    }


  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingBreed ? 'Edit Breed' : 'Add Breed '}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Text color="gray.600">
              {editingBreed ? 'Edit' : 'Select'} the breed you offer and add photos
            </Text>

            <FormControl>
              <FormLabel htmlFor="breed" fontWeight="semibold">
                Breed
              </FormLabel>
              <Select
                placeholder="Select breed..."
                colorScheme="brand"
                options={breedOptions}
                value={selectedBreed ? { label: selectedBreed.name, value: selectedBreed.id } : null}
                onChange={onSelectBreed}
                isDisabled={editingBreed}
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
                selectedFiles={selectedImages}
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
              onClick={editingBreed ? handleUpdate : handleSubmit}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              {editingBreed ? 'Update Breed' : 'Add Breed '}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
