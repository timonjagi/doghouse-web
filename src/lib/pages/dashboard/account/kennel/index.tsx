import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { MdOutlineLocationOn, MdBusiness } from 'react-icons/md';
import { Loader } from 'lib/components/ui/Loader';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { useBreederProfile, useUpsertBreederProfile } from 'lib/hooks/queries/useBreederProfile';
import { NextSeo } from 'next-seo';

interface KennelFormData {
  kennel_name: string;
  kennel_location: string;
  facility_type: string;
}

export const KennelPage: React.FC = () => {
  const toast = useToast();
  const { data: userProfile, isLoading: userLoading, error: userError } = useUserProfile();
  const { data: breederProfile, isLoading: profileLoading } = useBreederProfile(userProfile?.id);
  const upsertBreederProfile = useUpsertBreederProfile();

  const [formData, setFormData] = useState<KennelFormData>({
    kennel_name: '',
    kennel_location: '',
    facility_type: '',
  });

  // Populate form with existing data
  useEffect(() => {
    if (breederProfile) {
      setFormData({
        kennel_name: breederProfile.kennel_name || '',
        kennel_location: breederProfile.kennel_location || '',
        facility_type: breederProfile.facility_type || '',
      });
    }
  }, [breederProfile]);

  // Show loading state
  if (userLoading || profileLoading) {
    return <Loader />;
  }

  // Show error state
  if (userError || !userProfile) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error loading kennel details</Text>
            <Text fontSize="sm">
              {userError?.message || 'Unable to load user profile'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  // Check if user is a breeder
  if (userProfile.role !== 'breeder') {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="warning">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Access Denied</Text>
            <Text fontSize="sm">
              This page is only available for breeders. Please contact support if you believe this is an error.
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  const handleInputChange = (field: keyof KennelFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await upsertBreederProfile.mutateAsync(formData);

      toast({
        title: 'Kennel details updated',
        description: 'Your kennel information has been updated successfully.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating kennel details',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const facilityOptions = [
    { value: 'home_based', label: 'Home-based', icon: MdBusiness },
    { value: 'dedicated_facility', label: 'Dedicated Facility', icon: MdBusiness },
    { value: 'mixed', label: 'Mixed', icon: MdBusiness },
  ];

  return (
    <>
      <NextSeo title="Kennel Details - DogHouse Kenya" />

      <Container maxW="7xl" py={{ base: 4, md: 0 }}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size={{ base: 'xs', lg: 'md' }}>
              Kennel Details
            </Heading>
            <Text color="gray.600" mt={2}>
              Update your kennel information and facility details
            </Text>
          </Box>

          {/* Kennel Form */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  {/* Kennel Name */}
                  <FormControl isRequired>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Kennel Name</FormLabel>
                      <Stack w="full">
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Icon as={MdBusiness} color="gray.300" boxSize={5} />
                          </InputLeftElement>
                          <Input
                            placeholder="Your kennel's name"
                            value={formData.kennel_name}
                            onChange={(e) => handleInputChange('kennel_name', e.target.value)}
                            maxW={{ md: '3xl' }}
                          />
                        </InputGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  {/* Kennel Location */}
                  <FormControl isRequired>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Kennel Location</FormLabel>
                      <Stack w="full">
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
                          </InputLeftElement>
                          <Input
                            placeholder="City, Country"
                            value={formData.kennel_location}
                            onChange={(e) => handleInputChange('kennel_location', e.target.value)}
                            maxW={{ md: '3xl' }}
                          />
                        </InputGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  {/* Facility Type */}
                  <FormControl isRequired>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Facility Type</FormLabel>
                      <Stack w="full">
                        <Select
                          placeholder="Select your facility type"
                          value={formData.facility_type}
                          onChange={(e) => handleInputChange('facility_type', e.target.value)}
                          maxW={{ md: '3xl' }}
                        >
                          {facilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </Stack>
                    </Stack>
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={upsertBreederProfile.isPending}
                    alignSelf="flex-end"
                    isDisabled={!formData.kennel_name || !formData.kennel_location || !formData.facility_type}
                  >
                    Save Kennel Details
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </>
  );
};
