import React from 'react';
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
  useColorModeValue,
} from '@chakra-ui/react';
import { ListingFormData } from '.';

interface PetDetailsStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const PetDetailsStep: React.FC<PetDetailsStepProps> = ({ data, updateData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  if (data.type === 'litter') {
    return (
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Litter Details
          </Text>
          <Text color="gray.600" fontSize="sm">
            Provide information about the litter of puppies.
          </Text>
        </Box>
        {/* 
        <HStack spacing={4}> */}
        <FormControl isRequired>
          <FormLabel>Birth Date</FormLabel>
          <Input
            type="date"
            value={data.birth_date || ''}
            onChange={(e) => updateData({ birth_date: e.target.value })}
            bg={bgColor}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Available Date</FormLabel>
          <Input
            type="date"
            value={data.available_date || ''}
            onChange={(e) => updateData({ available_date: e.target.value })}
            bg={bgColor}
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
            <NumberInputField bg={bgColor} />
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
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Pet Details
        </Text>
        <Text color="gray.600" fontSize="sm">
          Provide information about your pet.
        </Text>
      </Box>

      <FormControl isRequired>
        <FormLabel>Pet Name</FormLabel>
        <Input
          placeholder="Enter your pet's name"
          value={data.pet_name || ''}
          onChange={(e) => updateData({ pet_name: e.target.value })}
          bg={bgColor}
        />
      </FormControl>

      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Age</FormLabel>
          <Input
            placeholder="e.g., 2 years, 6 months"
            value={data.pet_age || ''}
            onChange={(e) => updateData({ pet_age: e.target.value })}
            bg={bgColor}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Gender</FormLabel>
          <Select
            placeholder="Select gender"
            value={data.pet_gender || ''}
            onChange={(e) => updateData({ pet_gender: e.target.value })}
            bg={bgColor}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </FormControl>
      </HStack>
    </VStack>
  );
};
