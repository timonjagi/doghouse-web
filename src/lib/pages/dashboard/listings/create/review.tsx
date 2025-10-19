import React from 'react';
import {
  VStack,
  Text,
  Box,
  SimpleGrid,
  Image,
  Button,
  Card,
  CardBody,
  Badge,
  Divider,
  useColorModeValue,
  Spinner,
  GridItem,
  Img,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { ListingFormData } from '.';

interface ReviewStepProps {
  data: ListingFormData;
  onSubmit: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data, onSubmit, isEditing = false, loading }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Not specified';
    return `KSH ${price.toLocaleString()}`;
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Review Your Listing
        </Text>
        <Text color="gray.600" fontSize="sm">
          Please review all information before publishing your listing.
        </Text>
      </Box>

      <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Basic Information */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Basic Information
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Title
                  </Text>
                  <Text>{data.title || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Type
                  </Text>
                  <Badge colorScheme={data.type === 'litter' ? 'blue' : 'green'}>
                    {data.type === 'litter' ? 'Litter' : 'Single Pet'}
                  </Badge>
                </Box>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Description
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {data.description || 'Not specified'}
                  </Text>
                </GridItem>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Pet Details */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Pet Details
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {data.type === 'litter' ? (
                  <>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Birth Date
                      </Text>
                      <Text>{formatDate(data.birth_date)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Available Date
                      </Text>
                      <Text>{formatDate(data.available_date)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Number of Puppies
                      </Text>
                      <Text>{data.number_of_puppies || 'Not specified'}</Text>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Pet Name
                      </Text>
                      <Text>{data.pet_name || 'Not specified'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Age
                      </Text>
                      <Text>{data.pet_age || 'Not specified'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Gender
                      </Text>
                      <Text>{data.pet_gender || 'Not specified'}</Text>
                    </Box>
                  </>
                )}
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Photos */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Photos ({data.photos?.length || 0})
              </Text>
              {data.photos && data.photos.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                  {data.photos.map((file, index) => (
                    <Box key={index} borderRadius="md" overflow="hidden" borderWidth={1}>
                      <Img
                        src={file && typeof file === 'string' ? file : URL.createObjectURL(file)}
                        alt={`Photo ${index + 1}`}
                        objectFit="cover"
                        w="full"
                        h="100px"
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Text color="gray.500" fontSize="sm">No photos added</Text>
              )}
            </Box>

            <Divider />

            {/* Pricing & Location */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Pricing & Location
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Price
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color="green.600">
                    {formatPrice(data.price)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Reservation Fee
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color="blue.600">
                    {formatPrice(data.reservation_fee)}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Location
                  </Text>
                  <Text>{data.location_text || 'Not specified'}</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Box>
        <Text fontSize="sm" color="gray.600">
          By publishing this listing, you agree to our terms of service and confirm that all information is accurate.
        </Text>
      </Box>

      <Button
        leftIcon={loading ? <Spinner size="sm" /> : <CheckIcon />}
        colorScheme="brand"
        size="lg"
        onClick={onSubmit}
        isLoading={loading}
        loadingText={isEditing ? "Updating..." : "Publishing..."}
      >
        {isEditing ? 'Update Listing' : 'Publish Listing'}
      </Button>
    </VStack>
  );
};
