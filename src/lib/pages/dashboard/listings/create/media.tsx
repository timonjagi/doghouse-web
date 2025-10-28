import React, { useState } from 'react';
import {
  VStack,
  Text,
  Box,
  useColorModeValue,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { ListingFormData } from '.';
import { Dropzone } from 'lib/components/ui/Dropzone';
import { useDropZone } from 'lib/hooks/useDropZone';

interface MediaStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const MediaStep: React.FC<MediaStepProps> = ({ data, updateData }) => {
  const [uploadError, setUploadError] = useState<string>('');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { onSelectImage: onSelectPetImage, onRemoveImage: onRemovePetImage, selectedImages: petImages } = useDropZone({
    selectedImages: data.photos || [],
    setSelectedImages: (updates: File[]) => updateData({ photos: updates }),
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const { onSelectImage: onSelectSireImage, onRemoveImage: onRemoveSireImage, selectedImages: sireImages } = useDropZone({
    selectedImages: data.parents?.sire?.photos || [],
    setSelectedImages: (updates: File[]) => updateData({
      parents: {
        ...data.parents,
        sire: {
          ...data.parents?.sire,
          photos: updates
        }
      }
    }),
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const { onSelectImage: onSelectDamImage, onRemoveImage: onRemoveDamImage, selectedImages: damImages } = useDropZone({
    selectedImages: data.parents?.dam?.photos || [],
    setSelectedImages: (updates: File[]) => updateData({
      parents: {
        ...data.parents,
        dam: {
          ...data.parents?.dam,
          photos: updates
        }
      }
    }),
    maxFiles: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });


  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold">
          Photos & Media
        </Text>
        <Text color="gray.600" fontSize="sm">
          Add high-quality photos to showcase your pet and parents.
        </Text>
      </Box>

      {uploadError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {uploadError}
        </Alert>
      )}

      {/* Pet Photos Section */}
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="brand.600">
                Pet Photos
              </Text>
              <Text fontSize="sm" color="gray.600">
                Add photos of your {data.type === 'litter' ? 'litter' : 'pet'}
              </Text>
            </Box>

            <FormControl isRequired>
              {/* <FormLabel>Pet Photos</FormLabel> */}

              <Dropzone
                selectedFiles={data.photos || []}
                onChange={onSelectPetImage}
                onRemove={onRemovePetImage}
                maxUploads={10}
              />
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Parents Photos Section */}
        <Card bg={bgColor}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="md" fontWeight="semibold" color="brand.600">
                  Sire (Father) Photos
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Add photos of the sire (father)
                </Text>
              </Box>
              <Dropzone
                selectedFiles={data.parents?.sire?.photos || []}
                onChange={onSelectSireImage}
                onRemove={onRemoveSireImage}
                maxUploads={3}
              />

            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor}>
          <CardBody>

            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="md" fontWeight="semibold" color="brand.600">
                  Dam (Mother) Photos
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Add photos of the dam (mother)
                </Text>
              </Box>
              <Dropzone
                selectedFiles={data.parents?.dam?.photos || []}
                onChange={onSelectDamImage}
                onRemove={onRemoveDamImage}
                maxUploads={3}
              />
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
      <Text fontSize="xs" color="gray.500">
        💡 Adding parent photos helps build trust and shows the quality of your breeding program.
      </Text>
      {/* {(!data.photos || data.photos.length === 0) && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Please add at least one photo of your pet to continue.
        </Alert>
      )} */}
    </VStack >
  );
};
