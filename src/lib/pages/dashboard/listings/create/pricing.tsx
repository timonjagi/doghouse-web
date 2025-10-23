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

      {/* Adoption Requirements Section */}
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">
                  Adoption Requirements
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Set requirements for potential adopters (optional)
                </Text>
              </Box>
              <Button size="sm" variant="outline" onClick={toggleRequirements}>
                {showRequirements ? 'Hide' : 'Show'} Requirements
              </Button>
            </HStack>

            {showRequirements && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <VStack align="start" spacing={3} flex={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">Application Required</Text>
                        <Switch
                          isChecked={data.requirements?.application || false}
                          onChange={(e) => updateData({
                            requirements: {
                              ...data.requirements,
                              application: e.target.checked
                            }
                          })}
                        />
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">Contract Required</Text>
                        <Switch
                          isChecked={data.requirements?.contract || false}
                          onChange={(e) => updateData({
                            requirements: {
                              ...data.requirements,
                              contract: e.target.checked
                            }
                          })}
                        />
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">Home Check Required</Text>
                        <Switch
                          isChecked={data.requirements?.homeCheck || false}
                          onChange={(e) => updateData({
                            requirements: {
                              ...data.requirements,
                              homeCheck: e.target.checked
                            }
                          })}
                        />
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">References Required</Text>
                        <Switch
                          isChecked={data.requirements?.references || false}
                          onChange={(e) => updateData({
                            requirements: {
                              ...data.requirements,
                              references: e.target.checked
                            }
                          })}
                        />
                      </HStack>
                    </VStack>
                  </HStack>

                  <FormControl>
                    <FormLabel fontSize="sm">Other Pets Policy</FormLabel>
                    <Select
                      placeholder="Select policy"
                      value={data.requirements?.otherPets || ''}
                      onChange={(e) => updateData({
                        requirements: {
                          ...data.requirements,
                          otherPets: e.target.value as any
                        }
                      })}
                      bg="white"
                    >
                      <option value="allowed">Other pets allowed</option>
                      <option value="no-dogs">No dogs allowed</option>
                      <option value="no-cats">No cats allowed</option>
                      <option value="none">No other pets</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Children Policy</FormLabel>
                    <Select
                      placeholder="Select policy"
                      value={data.requirements?.children || ''}
                      onChange={(e) => updateData({
                        requirements: {
                          ...data.requirements,
                          children: e.target.value as any
                        }
                      })}
                      bg="white"
                    >
                      <option value="allowed">Children allowed</option>
                      <option value="no-young-children">No young children</option>
                      <option value="none">No children</option>
                    </Select>
                  </FormControl>
                </VStack>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>

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
