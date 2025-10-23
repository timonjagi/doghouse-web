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
} from '@chakra-ui/react';
import { ListingFormData } from '.';

interface PetDetailsStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const PetDetailsStep: React.FC<PetDetailsStepProps> = ({ data, updateData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const { isOpen: showHealth, onToggle: toggleHealth } = useDisclosure({
    defaultIsOpen: false
  });
  const { isOpen: showTraining, onToggle: toggleTraining } = useDisclosure({
    defaultIsOpen: false
  });

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

        {/* Health Information Section */}
        <Card bg={bgColor}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="center">
                <Box>
                  <Text fontSize="md" fontWeight="semibold">
                    Health Information
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Add health details and vaccination status
                  </Text>
                </Box>
                <Button size="sm" variant="outline" onClick={toggleHealth}>
                  {showHealth ? 'Hide' : 'Show'} Health
                </Button>
              </HStack>

              {showHealth && (
                <>
                  <Divider />
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm">Vaccinations Completed</FormLabel>
                        <NumberInput
                          min={0}
                          max={data.number_of_puppies || 20}
                          value={data.health?.vaccinations?.length || 0}
                          onChange={(_, value) => {
                            const currentVaccinations = data.health?.vaccinations || [];
                            const newVaccinations = Array(value).fill(null).map((_, index) => ({
                              type: `vaccination_${index + 1}`,
                              date: new Date().toISOString(),
                              completed: true
                            }));
                            updateData({
                              health: {
                                ...data.health,
                                vaccinations: newVaccinations
                              }
                            });
                          }}
                        >
                          <NumberInputField bg="white" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm">Health Tested</Text>
                      <Switch
                        isChecked={data.health?.healthTests?.dna || false}
                        onChange={(e) => updateData({
                          health: {
                            ...data.health,
                            healthTests: {
                              ...data.health?.healthTests,
                              dna: e.target.checked
                            }
                          }
                        })}
                      />
                    </HStack>

                    <FormControl>
                      <FormLabel fontSize="sm">Medical Notes</FormLabel>
                      <Textarea
                        placeholder="Any health concerns or special care requirements..."
                        value={data.health?.medicalNotes || ''}
                        onChange={(e) => updateData({
                          health: {
                            ...data.health,
                            medicalNotes: e.target.value
                          }
                        })}
                        rows={2}
                        bg="white"
                      />
                    </FormControl>
                  </VStack>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>
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

      {/* Health Information Section for Single Pets */}
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">
                  Health Information
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Add health details and vaccination status
                </Text>
              </Box>
              <Button size="sm" variant="outline" onClick={toggleHealth}>
                {showHealth ? 'Hide' : 'Show'} Health
              </Button>
            </HStack>

            {showHealth && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm">Vaccinations Completed</FormLabel>
                      <NumberInput
                        min={0}
                        max={10}
                        value={data.health?.vaccinations?.length || 0}
                        onChange={(_, value) => {
                          const currentVaccinations = data.health?.vaccinations || [];
                          const newVaccinations = Array(value).fill(null).map((_, index) => ({
                            type: `vaccination_${index + 1}`,
                            date: new Date().toISOString(),
                            completed: true
                          }));
                          updateData({
                            health: {
                              ...data.health,
                              vaccinations: newVaccinations
                            }
                          });
                        }}
                      >
                        <NumberInputField bg="white" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm">Health Tested</Text>
                    <Switch
                      isChecked={data.health?.healthTests?.dna || false}
                      onChange={(e) => updateData({
                        health: {
                          ...data.health,
                          healthTests: {
                            ...data.health?.healthTests,
                            dna: e.target.checked
                          }
                        }
                      })}
                    />
                  </HStack>

                  <FormControl>
                    <FormLabel fontSize="sm">Medical Notes</FormLabel>
                    <Textarea
                      placeholder="Any health concerns or special care requirements..."
                      value={data.health?.medicalNotes || ''}
                      onChange={(e) => updateData({
                        health: {
                          ...data.health,
                          medicalNotes: e.target.value
                        }
                      })}
                      rows={2}
                      bg="white"
                    />
                  </FormControl>
                </VStack>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Training Information Section */}
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">
                  Training Information
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Add training details and milestones
                </Text>
              </Box>
              <Button size="sm" variant="outline" onClick={toggleTraining}>
                {showTraining ? 'Hide' : 'Show'} Training
              </Button>
            </HStack>

            {showTraining && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <VStack align="start" spacing={2} flex={1}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">House Trained</Text>
                        <Switch
                          isChecked={data.training?.houseTrained || false}
                          onChange={(e) => updateData({
                            training: {
                              ...data.training,
                              houseTrained: e.target.checked
                            }
                          })}
                        />
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">Crate Trained</Text>
                        <Switch
                          isChecked={data.training?.crateTrained || false}
                          onChange={(e) => updateData({
                            training: {
                              ...data.training,
                              crateTrained: e.target.checked
                            }
                          })}
                        />
                      </HStack>

                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm">Basic Commands</Text>
                        <Switch
                          isChecked={data.training?.basicCommands || false}
                          onChange={(e) => updateData({
                            training: {
                              ...data.training,
                              basicCommands: e.target.checked
                            }
                          })}
                        />
                      </HStack>
                    </VStack>
                  </HStack>

                  <FormControl>
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
                  </FormControl>
                </VStack>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
