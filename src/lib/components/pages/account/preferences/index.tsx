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
  Select,
  Radio,
  RadioGroup,
  useToast,
} from '@chakra-ui/react';
import { Loader } from 'lib/components/ui/Loader';
import { useUserProfile } from 'lib/hooks/queries/useUserProfile';
import { useSeekerProfile, useUpsertSeekerProfile } from 'lib/hooks/queries/useSeekerProfile';
import { useBreeds } from 'lib/hooks/queries';
import { Select as ChakraSelect } from 'chakra-react-select';
import { RadioButton } from 'lib/components/ui/RadioButton';
import { RadioButtonGroup } from 'lib/components/ui/RadioButtonGroup';
import { NextSeo } from 'next-seo';
import breedsData from 'lib/data/breeds_with_group_and_traits.json';

interface PreferencesFormData {
  preferred_breed_name: string;
  preferred_age: string;
  preferred_sex: string;
  spay_neuter_preference: string;
  activity_level: string;
}

export const PreferencesPage: React.FC = () => {
  const toast = useToast();
  const { data: userProfile, isLoading: userLoading, error: userError } = useUserProfile();
  const { data: seekerProfile, isLoading: profileLoading } = useSeekerProfile(userProfile?.id);
  const upsertSeekerProfile = useUpsertSeekerProfile();
  const { data: breeds } = useBreeds();

  const [formData, setFormData] = useState<PreferencesFormData>({
    preferred_breed_name: '',
    preferred_age: '',
    preferred_sex: '',
    spay_neuter_preference: '',
    activity_level: '',
  });

  const [selectedBreed, setSelectedBreed] = useState<any>(null);

  // Populate form with existing data
  useEffect(() => {
    if (seekerProfile) {
      setFormData({
        preferred_breed_name: seekerProfile.preferred_breed_name || '',
        preferred_age: seekerProfile.preferred_age || '',
        preferred_sex: seekerProfile.preferred_sex || '',
        spay_neuter_preference: seekerProfile.spay_neuter_preference || '',
        activity_level: seekerProfile.activity_level || '',
      });

      // Set selected breed
      if (seekerProfile.preferred_breed_name) {
        const breed = breedsData.find((b) => b.name === seekerProfile.preferred_breed_name);
        setSelectedBreed(breed);
      }
    }
  }, [seekerProfile]);

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
            <Text fontWeight="bold">Error loading preferences</Text>
            <Text fontSize="sm">
              {userError?.message || 'Unable to load user profile'}
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  // Check if user is a seeker
  if (userProfile.role !== 'seeker') {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="warning">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Access Denied</Text>
            <Text fontSize="sm">
              This page is only available for seekers. Please contact support if you believe this is an error.
            </Text>
          </Box>
        </Alert>
      </Container>
    );
  }

  const handleInputChange = (field: keyof PreferencesFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBreedSelect = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedBreed(selectedOption.breed);
      handleInputChange('preferred_breed_name', selectedOption.breed.name);
    } else {
      setSelectedBreed(null);
      handleInputChange('preferred_breed_name', '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data for submission
      const submitData = {
        preferred_breed_name: formData.preferred_breed_name,
        preferred_age: formData.preferred_age,
        preferred_sex: formData.preferred_sex,
        spay_neuter_preference: formData.spay_neuter_preference,
        activity_level: formData.activity_level,
      };

      // If breed is selected, also update breed_id
      if (selectedBreed && breeds) {
        const dbBreed = breeds.find((b) => b.name === selectedBreed.name);
        if (dbBreed) {
          (submitData as any).preferred_breed_id = dbBreed.id;
        }
      }

      await upsertSeekerProfile.mutateAsync(submitData);

      toast({
        title: 'Preferences updated',
        description: 'Your preferences have been updated successfully.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating preferences',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const breedOptions = breedsData.map((breed) => ({
    label: breed.name,
    value: breed.name,
    breed: breed,
  }));

  const livingSituationOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'compound', label: 'Compound with yard' },
    { value: 'farm', label: 'Farm/Rural property' },
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner - First time dog owner' },
    { value: 'intermediate', label: 'Intermediate - Some experience' },
    { value: 'experienced', label: 'Experienced - Multiple dogs owned' },
  ];

  const ageOptions = [
    { value: 'puppy', label: 'Puppy (under 1 year)' },
    { value: 'adolescent', label: 'Adolescent (1-2 years)' },
    { value: 'adult', label: 'Adult (2+ years)' },
  ];

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'either', label: 'No preference' },
  ];

  const spayNeuterOptions = [
    { value: 'yes', label: 'Already spayed/neutered preferred' },
    { value: 'no', label: 'Will spay/neuter myself' },
    { value: 'unsure', label: 'Unsure/No preference' },
  ];

  const activityOptions = [
    { value: 'low', label: 'Low energy (couch potato)' },
    { value: 'moderate', label: 'Moderate energy (daily walks)' },
    { value: 'high', label: 'High energy (very active)' },
  ];

  const yesNoOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  return (
    <>
      <NextSeo title="Preferences - DogHouse Kenya" />

      <Container maxW="4xl" py={{ base: 4, md: 0 }}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size={{ base: 'xs', lg: 'md' }}>
              Adoption Preferences
            </Heading>
            <Text color="gray.600" mt={2}>
              Update your preferences for finding the perfect dog companion
            </Text>
          </Box>

          {/* Preferences Form */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Preferred Breed</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <ChakraSelect
                          placeholder="Select preferred breed..."
                          options={breedOptions}
                          value={selectedBreed ? { label: selectedBreed.name, value: selectedBreed.id } : null}
                          onChange={handleBreedSelect}
                        />
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Preferred Age</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioGroup
                          value={formData.preferred_age}
                          onChange={(value) => handleInputChange('preferred_age', value)}
                        >
                          <Stack>
                            {ageOptions.map((option) => (
                              <Radio key={option.value} value={option.value}>
                                {option.label}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Preferred Sex</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioGroup
                          value={formData.preferred_sex}
                          onChange={(value) => handleInputChange('preferred_sex', value)}
                        >
                          <Stack>
                            {sexOptions.map((option) => (
                              <Radio key={option.value} value={option.value}>
                                {option.label}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Spay/Neuter Preference</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioGroup
                          value={formData.spay_neuter_preference}
                          onChange={(value) => handleInputChange('spay_neuter_preference', value)}
                        >
                          <Stack>
                            {spayNeuterOptions.map((option) => (
                              <Radio key={option.value} value={option.value}>
                                {option.label}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={{ base: '1.5', md: '8' }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Preferred Activity Level</FormLabel>
                      <Stack w="full" maxW={{ md: '3xl' }}>
                        <RadioGroup
                          value={formData.activity_level}
                          onChange={(value) => handleInputChange('activity_level', value)}
                        >
                          <Stack>
                            {activityOptions.map((option) => (
                              <Radio key={option.value} value={option.value}>
                                {option.label}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Stack>
                    </Stack>
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={upsertSeekerProfile.isPending}
                    alignSelf="flex-end"
                  >
                    Save Preferences
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
