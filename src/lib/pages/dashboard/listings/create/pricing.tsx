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
  Text,
  Box,
  HStack,
  Card,
  CardBody,
  Divider,
  Switch,
  Select,
  useColorModeValue,
  useDisclosure,
  Button,
  Stack,
  Link,
} from '@chakra-ui/react';
import { ListingFormData } from '.';

interface PricingStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const PricingStep: React.FC<PricingStepProps> = ({ data, updateData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const { isOpen: showRequirements, onToggle: toggleRequirements } = useDisclosure({
    defaultIsOpen: false
  });

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold">
          Pricing
        </Text>
        <Text color="gray.600" fontSize="sm">
          Set the adoption price and reservation fee for your listing
        </Text>
      </Box>

      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
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
            </Stack>

            <Divider />

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

            <Divider />

            <Text fontSize="xs" color="gray.500">
              Note: Doghouse takes a 10% commission on your adoption price. Read our{' '}<Text as={Link} color="brand.600" cursor="pointer" href="/terms#listing" target="_blank">Listing Terms</Text> to learn more.
            </Text>

          </VStack>

        </CardBody>
      </Card>
    </VStack >
  );
};
