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
  Text,
  Box,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ListingFormData } from '.';

interface PricingStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const PricingStep: React.FC<PricingStepProps> = ({ data, updateData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Pricing & Location
        </Text>
        <Text color="gray.600" fontSize="sm">
          Set your pricing and location information for the listing.
        </Text>
      </Box>

      <HStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Price (KSH)</FormLabel>
          <NumberInput
            min={0}
            value={data.price || ''}
            onChange={(_, value) => updateData({ price: value })}
          >
            <NumberInputField
              placeholder="0"
              bg={bgColor}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Full adoption price per puppy/pet
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel>Reservation Fee (KSH)</FormLabel>
          <NumberInput
            min={0}
            value={data.reservation_fee || ''}
            onChange={(_, value) => updateData({ reservation_fee: value })}
          >
            <NumberInputField
              placeholder="0"
              bg={bgColor}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Optional deposit to reserve (refundable)
          </Text>
        </FormControl>
      </HStack>

      <FormControl isRequired>
        <FormLabel>Location</FormLabel>
        <Input
          placeholder="e.g., Nairobi, Kenya"
          value={data.location_text || ''}
          onChange={(e) => updateData({ location_text: e.target.value })}
          bg={bgColor}
        />
        <Text fontSize="xs" color="gray.500" mt={1}>
          City and country where the pet is located
        </Text>
      </FormControl>

      <Box>
        <Text fontSize="sm" color="gray.600" mb={3}>
          💡 <strong>Tips for pricing:</strong>
        </Text>
        <VStack align="start" spacing={2} pl={4}>
          <Text fontSize="xs" color="gray.500">
            • Research similar listings to set competitive prices
          </Text>
          <Text fontSize="xs" color="gray.500">
            • Consider including initial vaccinations and health checks in your price
          </Text>
          <Text fontSize="xs" color="gray.500">
            • Reservation fees help ensure serious inquiries
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};
