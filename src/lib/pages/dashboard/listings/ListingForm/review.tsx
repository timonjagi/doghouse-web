import React from 'react';
import {
  VStack,
  Text,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Divider,
  useColorModeValue,
  GridItem,
  Img,
  HStack,
  Link,
  Stack,
} from '@chakra-ui/react';
import { ListingFormData } from '.';

interface ReviewStepProps {
  data: ListingFormData;
  userBreeds?: any[];
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data, userBreeds }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Not specified';
    return `KSH ${price.toLocaleString()}`;
  };

  const getBreedName = (breedId?: string) => {
    if (!breedId) return 'Not specified';
    const breed = userBreeds?.find((breed: any) => breed.id === breedId);
    return breed?.breeds?.name || 'Not specified';
  }
  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold">
          Review Your Listing
        </Text>
        <Text color="gray.600" fontSize="sm">
          Please review all information before publishing your listing.
        </Text>
      </Box>

      <Card bg={bgColor} boxShadow="none">
        <CardBody>
          <VStack spacing={6} align="stretch">


            {/* Pet Details */}
            <Box w="full">
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Pet Details
              </Text>
              <SimpleGrid columns={{ base: 2, lg: 3 }} spacing={4}>
                {data.type === 'litter' ? (
                  <>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Type
                      </Text>
                      <Badge colorScheme='blue'>
                        Litter
                      </Badge>
                    </Box>
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
                        Type
                      </Text>
                      <Badge colorScheme='green'>
                        Single Pet
                      </Badge>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Breed
                      </Text>
                      <Text>{getBreedName(data.user_breed_id)}</Text>
                    </Box>
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

                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        House Trained
                      </Text>
                      <Text>{data.training?.houseTrained ? 'Yes' : 'No'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Crate Trained
                      </Text>
                      <Text>{data.training?.crateTrained ? 'Yes' : 'No'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                        Basic Commands
                      </Text>
                      <Text>{data.training?.basicCommands ? 'Yes' : 'No'}</Text>
                    </Box>
                  </>
                )}
              </SimpleGrid>
            </Box>

            <Divider />

            <Box>

              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                  Parent Details
                </Text>
              </Box>
              <SimpleGrid columns={{ base: 2, lg: 3 }} spacing={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Sire Breed
                  </Text>
                  <Text>{data.parents?.sire?.breed || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Sire  Name
                  </Text>
                  <Text>{data.parents?.sire?.name || 'Not specified'}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Sire  Reg. Number
                  </Text>
                  <Text>{data.parents?.sire?.registration || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Dam Breed
                  </Text>
                  <Text>{data.parents?.dam?.breed || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Dam Name
                  </Text>
                  <Text>{data.parents?.dam?.name || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                    Dam Reg. Number
                  </Text>
                  <Text>{data.parents?.dam?.registration || 'Not specified'}</Text>
                </Box>
              </SimpleGrid>
            </Box>
            <Divider />

            {/* Photos */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Pet Photos ({data.photos?.length || 0})
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

            {/* Sire  and Dam Photos */}
            {data.parents?.sire?.photos && data.parents.sire.photos.length > 0 && (
              <>
                <Box >
                  <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                    Parent Photos ({data.parents.sire.photos.length + (data.parents.dam?.photos ? data.parents.dam.photos.length : 0)})
                  </Text>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    {data.parents.sire.photos.map((file, index) => (
                      <Box key={index} borderRadius="md" overflow="hidden" borderWidth={1}>
                        <Img
                          src={file && typeof file === 'string' ? file : URL.createObjectURL(file)}
                          alt={`Sire Photo ${index + 1}`}
                          objectFit="cover"
                          w="full"
                          h="100px"
                        />
                      </Box>
                    ))}

                    {data.parents.dam.photos.map((file, index) => (
                      <Box key={index} borderRadius="md" overflow="hidden" borderWidth={1}>
                        <Img

                          src={file && typeof file === 'string' ? file : URL.createObjectURL(file)}
                          alt={`Dam Photo ${index + 1}`}
                          objectFit="cover"
                          w="full"
                          h="100px"
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
                <Divider />
              </>

            )}

            {/* Health Info */}
            <Stack>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Health Info
              </Text>

              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                  Vaccinations ({data.health?.vaccinations?.length || 0})
                </Text>
                <HStack>

                  {data.health?.vaccinations && data.health.vaccinations.length > 0 ? (
                    data.health.vaccinations.map((vaccination, index) => (
                      <Badge key={index} colorScheme="brand" variant="outline" px={2} py={1} borderRadius="md">
                        <Text>{vaccination.type}</Text>
                        <Text fontSize="xs" color="muted">{new Date(vaccination.date).toDateString()}</Text>

                      </Badge>
                    )
                    )) : (
                    <Text color="gray.500" fontSize="sm">No vaccinations added</Text>
                  )}
                </HStack>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                  Certificates ({data.health.certificates?.length || 0})
                </Text>
                {data.health.certificates && data.health.certificates.length > 0 ? (
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    {data.health.certificates.map((file, index) => (
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
                  <Text color="gray.500" fontSize="sm">No certificates added</Text>
                )}
              </Box>




              <Box>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" mb={1}>
                  Medical Notes
                </Text>

                <Text>{data.health.medicalNotes || 'Not specified'}</Text>
              </Box>
            </Stack>

            <Divider />

            {/* Pricing & Location */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Pricing
              </Text>
              <SimpleGrid columns={{ base: 2, md: 2 }} spacing={4}>
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
              </SimpleGrid>
            </Box>

            <Divider />


            <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="brand.600">
                Requirements
              </Text>
              <HStack align="start" spacing={1} wrap="wrap">
                {data.requirements?.contract && <Badge fontSize="sm" >Adoption Contract</Badge>}
                {data.requirements?.homeCheck && <Badge fontSize="sm">Home Check</Badge>}
                {data.requirements?.experience && <Badge fontSize="sm">Previous Pet Experience</Badge>}
                {data.requirements?.yard && <Badge fontSize="sm">Yard Requirement</Badge>}
                {data.requirements?.otherPets && <Badge fontSize="sm">{data.requirements.otherPets === 'allowed' ? 'Other Pets Allowed' : data.requirements.otherPets === 'no-dogs' ? 'No Dogs' : data.requirements.otherPets === 'no-cats' ? 'No Cats' : 'No Other Pets'}</Badge>}
                {data.requirements?.children && <Badge fontSize="sm">{data.requirements.children === 'allowed' ? 'Children Allowed' : data.requirements.children === 'no-young-children' ? 'No Young Children' : 'None'}</Badge>}
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      <Box textAlign="center">
        <Text fontSize="sm" color="gray.600">
          By publishing this listing, you agree to our <Text as={Link} color="brand.600" cursor="pointer" href="/terms#listing-requirements" target="_blank">Terms of Service</Text> and confirm that all information is accurate.
        </Text>
      </Box>


    </VStack >
  );
};
