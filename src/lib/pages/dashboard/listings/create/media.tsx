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
  Card,
  CardBody,
  Divider,
  SimpleGrid,
  Image,
  IconButton,
  HStack,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useDragDrop } from '../../../../hooks/useDragDrop';
import { ListingFormData } from '.';

interface MediaStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const MediaStep: React.FC<MediaStepProps> = ({ data, updateData }) => {
  const [uploadError, setUploadError] = useState<string>('');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen: showParents, onToggle: toggleParents } = useDisclosure({
    defaultIsOpen: false
  });

  const onDropPetPhotos = useCallback((acceptedFiles: File[]) => {
    setUploadError('');

    // Validate file types
    const invalidFiles = acceptedFiles.filter(file =>
      !file.type.startsWith('image/')
    );

    if (invalidFiles.length > 0) {
      setUploadError('Please select only image files.');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const oversizedFiles = acceptedFiles.filter(file => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      setUploadError('Each image must be smaller than 5MB.');
      return;
    }

    // Limit to 10 photos
    const currentPhotos = data.photos || [];
    if (currentPhotos.length + acceptedFiles.length > 10) {
      setUploadError('Maximum 10 photos allowed.');
      return;
    }

    updateData({ photos: [...currentPhotos, ...acceptedFiles] });
  }, [data.photos, updateData]);

  const onDropParentPhotos = useCallback((parentType: 'sire' | 'dam') => (acceptedFiles: File[]) => {
    setUploadError('');

    // Validate file types
    const invalidFiles = acceptedFiles.filter(file =>
      !file.type.startsWith('image/')
    );

    if (invalidFiles.length > 0) {
      setUploadError('Please select only image files.');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const oversizedFiles = acceptedFiles.filter(file => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      setUploadError('Each image must be smaller than 5MB.');
      return;
    }

    // Limit to 3 photos per parent
    const currentParentPhotos = data.parents?.[parentType]?.photos || [];
    if (currentParentPhotos.length + acceptedFiles.length > 3) {
      setUploadError(`Maximum 3 photos allowed per ${parentType}.`);
      return;
    }

    updateData({
      parents: {
        ...data.parents,
        [parentType]: {
          ...data.parents?.[parentType],
          photos: [...currentParentPhotos, ...acceptedFiles]
        }
      }
    });
  }, [data.parents, updateData]);

  const { getRootProps: getPetPhotosRootProps, getInputProps: getPetPhotosInputProps, isDragActive: isPetDragActive } = useDragDrop({
    onFilesSelected: onDropPetPhotos,
    maxFiles: 10,
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const { getRootProps: getSirePhotosRootProps, getInputProps: getSirePhotosInputProps, isDragActive: isSireDragActive } = useDragDrop({
    onFilesSelected: onDropParentPhotos('sire'),
    maxFiles: 3,
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const { getRootProps: getDamPhotosRootProps, getInputProps: getDamPhotosInputProps, isDragActive: isDamDragActive } = useDragDrop({
    onFilesSelected: onDropParentPhotos('dam'),
    maxFiles: 3,
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const removePetPhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index);
    updateData({ photos: newPhotos });
  };

  const removeParentPhoto = (parentType: 'sire' | 'dam', index: number) => {
    const currentParentPhotos = data.parents?.[parentType]?.photos || [];
    const newPhotos = currentParentPhotos.filter((_, i) => i !== index);
    updateData({
      parents: {
        ...data.parents,
        [parentType]: {
          ...data.parents?.[parentType],
          photos: newPhotos
        }
      }
    });
  };

  const renderPhotoPreview = (file: File | string, index: number, onRemove: (index: number) => void) => {
    const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    return (
      <Box key={index} position="relative" borderRadius="lg" overflow="hidden">
        <Image
          src={previewUrl}
          alt={`Preview ${index + 1}`}
          objectFit="cover"
          w="full"
          h="150px"
        />
        <IconButton
          aria-label="Remove photo"
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="red"
          position="absolute"
          top={2}
          right={2}
          onClick={() => onRemove(index)}
        />
      </Box>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
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
            <Text fontSize="md" fontWeight="semibold" color="brand.600">
              Pet Photos
            </Text>
            <Text fontSize="sm" color="gray.600">
              Add photos of your {data.type === 'litter' ? 'litter' : 'pet'}
            </Text>

            <FormControl isRequired>
              <FormLabel>Pet Photos</FormLabel>

              {/* Drop Zone */}
              <Box
                {...getPetPhotosRootProps()}
                border="2px dashed"
                borderColor={isPetDragActive ? 'brand.400' : borderColor}
                borderRadius="lg"
                p={6}
                textAlign="center"
                bg={isPetDragActive ? 'brand.50' : bgColor}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: 'brand.300' }}
              >
                <input {...getPetPhotosInputProps()} />
                <VStack spacing={3}>
                  <AddIcon w={8} h={8} color="gray.400" />
                  <Text fontSize="md" fontWeight="medium">
                    {isPetDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    or click to browse files
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    JPG, PNG up to 5MB each • Maximum 10 photos
                  </Text>
                </VStack>
              </Box>
            </FormControl>

            {/* Pet Photo Previews */}
            {data.photos && data.photos.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={3}>
                  Selected Photos ({data.photos.length}/10)
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
                  {data.photos.map((file, index) => renderPhotoPreview(file, index, removePetPhoto))}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Parents Photos Section */}
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold" color="brand.600">
                  Parents Photos
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Add photos of the sire and dam (optional but recommended)
                </Text>
              </Box>
              <Button size="sm" variant="outline" onClick={toggleParents}>
                {showParents ? 'Hide' : 'Show'} Parents Photos
              </Button>
            </HStack>

            {showParents && (
              <>
                <Divider />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Sire Photos */}
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.600" mb={3}>
                      Sire (Father) Photos
                    </Text>

                    <Box
                      {...getSirePhotosRootProps()}
                      border="2px dashed"
                      borderColor={isSireDragActive ? 'blue.400' : borderColor}
                      borderRadius="lg"
                      p={4}
                      textAlign="center"
                      bg={isSireDragActive ? 'blue.50' : bgColor}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: 'blue.300' }}
                    >
                      <input {...getSirePhotosInputProps()} />
                      <VStack spacing={2}>
                        <AddIcon w={6} h={6} color="gray.400" />
                        <Text fontSize="xs" fontWeight="medium">
                          {isSireDragActive ? 'Drop sire photos here' : 'Drag & drop sire photos'}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          Maximum 3 photos
                        </Text>
                      </VStack>
                    </Box>

                    {data.parents?.sire?.photos && data.parents.sire.photos.length > 0 && (
                      <SimpleGrid columns={3} spacing={2} mt={3}>
                        {data.parents.sire.photos.map((file, index) => renderPhotoPreview(file, index, (i) => removeParentPhoto('sire', i)))}
                      </SimpleGrid>
                    )}
                  </Box>

                  {/* Dam Photos */}
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="pink.600" mb={3}>
                      Dam (Mother) Photos
                    </Text>

                    <Box
                      {...getDamPhotosRootProps()}
                      border="2px dashed"
                      borderColor={isDamDragActive ? 'pink.400' : borderColor}
                      borderRadius="lg"
                      p={4}
                      textAlign="center"
                      bg={isDamDragActive ? 'pink.50' : bgColor}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: 'pink.300' }}
                    >
                      <input {...getDamPhotosInputProps()} />
                      <VStack spacing={2}>
                        <AddIcon w={6} h={6} color="gray.400" />
                        <Text fontSize="xs" fontWeight="medium">
                          {isDamDragActive ? 'Drop dam photos here' : 'Drag & drop dam photos'}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          Maximum 3 photos
                        </Text>
                      </VStack>
                    </Box>

                    {data.parents?.dam?.photos && data.parents.dam.photos.length > 0 && (
                      <SimpleGrid columns={3} spacing={2} mt={3}>
                        {data.parents.dam.photos.map((file, index) => renderPhotoPreview(file, index, (i) => removeParentPhoto('dam', i)))}
                      </SimpleGrid>
                    )}
                  </Box>
                </SimpleGrid>

                <Text fontSize="xs" color="gray.500">
                  💡 Adding parent photos helps build trust and shows the quality of your breeding program.
                </Text>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>

      {(!data.photos || data.photos.length === 0) && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Please add at least one photo of your pet to continue.
        </Alert>
      )}
    </VStack>
  );
};
