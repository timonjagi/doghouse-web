import React, { useCallback, useState } from 'react';
import {
  VStack,
  Text,
  Box,
  useColorModeValue,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Dropzone } from 'lib/components/ui/Dropzone';
import { useDropZone } from 'lib/hooks/useDropZone';
import { ListingFormData } from '.';

interface MediaStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const MediaStep: React.FC<MediaStepProps> = ({ data, updateData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { onSelectImage, onRemoveImage, selectedImages } = useDropZone({
    selectedImages: data.photos,
    setSelectedImages: (images) => updateData({ photos: images }),
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Photos & Media
        </Text>
        <Text color="gray.600" fontSize="sm">
          Add high-quality photos to showcase your pet. First photo will be the main image.
        </Text>
      </Box>

      <FormControl isRequired>
        <FormLabel>Pet Photos</FormLabel>
        <Dropzone
          selectedFiles={selectedImages}
          onChange={onSelectImage}
          onRemove={onRemoveImage}
          maxUploads={4}
        />
      </FormControl>

      {(!data.photos || data.photos.length === 0) && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Please add at least one photo of your pet to continue.
        </Alert>
      )}
    </VStack>
  );
};
