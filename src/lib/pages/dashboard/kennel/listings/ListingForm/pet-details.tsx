import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
  Box,
  HStack,
  Card,
  CardBody,
  Divider,
  Switch,
  useColorModeValue,
  useDisclosure,
  Button,
  Textarea,
  Stack,
  Alert,
  AlertIcon,
  Link,
} from '@chakra-ui/react';
import { ListingFormData } from '.';

interface PetDetailsStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
  userBreeds?: any[];
}

export const PetDetailsStep: React.FC<PetDetailsStepProps> = ({ data, updateData, userBreeds }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');


  if (userBreeds?.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        No breeds added yet. Please add a breed first.

        <Button as={Link} href="/dashboard/breeds">Add Breed</Button>
      </Alert>
    );
  }

  if (data.type === 'litter') {
    return (
      <Card bg="white">
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="lg" fontWeight="semibold">
                  Litter Details
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Provide information about the litter of puppies.
                </Text>
              </Box>
            </HStack>

            <FormControl>
              <FormLabel>Breed</FormLabel>
              <Select
                placeholder="Select breed"
                value={data.user_breed_id || ''}
                onChange={(e) => updateData({ user_breed_id: e.target.value || undefined })}
                bg="white"
              >
                {userBreeds?.map((userBreed) => (
                  <option key={userBreed.id} value={userBreed.id}>
                    {userBreed.breeds?.name}
                  </option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                You can only select from the breeds you have added. To add a new breed, go to the <Text as={Link} color="brand.600" cursor="pointer" href="/dashboard/breeds/manage">Manage Breeds</Text> page.
              </Text>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Birth Date</FormLabel>
              <Input
                type="date"
                value={data.birth_date || ''}
                onChange={(e) => updateData({ birth_date: e.target.value })}
                bg="white"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Available Date</FormLabel>
              <Input
                type="date"
                value={data.available_date || ''}
                onChange={(e) => updateData({ available_date: e.target.value })}
                bg="white"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Number of Puppies</FormLabel>
              <NumberInput
                min={1}
                max={20}
                value={data.number_of_puppies || ''}
                onChange={(_, value) => updateData({ number_of_puppies: value })}
              >
                <NumberInputField bg="white" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text fontSize="xs" color="gray.500" mt={1}>
                How many puppies are available for adoption?
              </Text>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Box>
          <Text fontSize="lg" fontWeight="semibold">
            Pet Details
          </Text>
          <Text color="gray.600" fontSize="sm">
            Provide information about your pet.
          </Text>
        </Box>
      </HStack>
      <Card bg={bgColor} >
        <CardBody>
          <VStack spacing={4} align="stretch">


            <FormControl isRequired>
              <FormLabel>Pet Name</FormLabel>
              <Input
                placeholder="Enter your pet's name"
                value={data.pet_name || ''}
                onChange={(e) => updateData({ pet_name: e.target.value })}
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Breed</FormLabel>
              <Select
                placeholder="Select breed"
                value={data.user_breed_id || ''}
                onChange={(e) => updateData({ user_breed_id: e.target.value || undefined })}
                bg="white"
              >
                {userBreeds?.map((userBreed) => (
                  <option key={userBreed.id} value={userBreed.id}>
                    {userBreed.breeds?.name}
                  </option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                You can only select from the breeds you have added. To add a new breed, go to the <Text as={Link} color="brand.600" cursor="pointer" href="/dashboard/breeds/manage">Manage Breeds</Text> page.
              </Text>
            </FormControl>


            <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <Input
                  placeholder="e.g., 2 years, 6 months"
                  value={data.pet_age || ''}
                  onChange={(e) => updateData({ pet_age: e.target.value })}
                  bg="white"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Select gender"
                  value={data.pet_gender || ''}
                  onChange={(e) => updateData({ pet_gender: e.target.value })}
                  bg="white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <HStack justify="space-between" w="full">

                <FormLabel >House Trained</FormLabel>
                <Switch
                  isChecked={data.training?.houseTrained || false}
                  onChange={(e) => updateData({
                    training: {
                      ...data.training,
                      houseTrained: e.target.checked
                    }
                  })}
                  colorScheme="brand"
                />
              </HStack>
            </FormControl>

            <FormControl isRequired>
              <HStack justify="space-between" w="full">
                <FormLabel fontSize="sm" fontWeight="medium">Crate Trained</FormLabel>
                <Switch
                  isChecked={data.training?.crateTrained || false}
                  onChange={(e) => updateData({
                    training: {
                      ...data.training,
                      crateTrained: e.target.checked
                    }
                  })}
                  colorScheme="brand"

                />
              </HStack>


            </FormControl>

            <FormControl isRequired>

              <HStack justify="space-between" w="full">
                <FormLabel fontSize="sm" fontWeight="medium">Basic Commands</FormLabel>
                <Switch
                  isChecked={data.training?.basicCommands || false}
                  onChange={(e) => updateData({
                    training: {
                      ...data.training,
                      basicCommands: e.target.checked
                    }
                  })}
                  colorScheme="brand"

                />
              </HStack>
            </FormControl>
            {/* <FormControl>
            <FormLabel fontSize="sm">Additional Training Notes</FormLabel>
            <Textarea
              placeholder="Any additional training information..."
              value={data.training?.additionalTraining || ''}
              onChange={(e) => updateData({
                training: {
                  ...data.training,
                  additionalTraining: e.target.value
                }
              })}
              rows={2}
              bg="white"
            />
          </FormControl> */}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
