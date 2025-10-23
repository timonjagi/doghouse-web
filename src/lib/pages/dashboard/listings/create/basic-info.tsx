import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Text,
  RadioGroup,
  Radio,
  HStack,
  Box,
  useColorModeValue,
  Alert,
  AlertIcon,
  Center,
  Button,
  Stack,
  Card,
  CardBody,
  Divider,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { Loader } from 'lib/components/ui/Loader';
import Link from 'next/link';
import { ListingFormData } from '.';

interface BasicInfoStepProps {
  data: ListingFormData;
  userBreeds?: any[];
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, userBreeds }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const { isOpen: showParents, onToggle: toggleParents } = useDisclosure({
    defaultIsOpen: false
  });

  if (userBreeds?.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        No breeds added yet. Please add a breed first.

        <Button as={Link} href="/dashboard/breeds/manage">Add Breed</Button>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Stack>
        <Text fontSize="lg" fontWeight="semibold" >
          Basic Information
        </Text>
        <Text color="gray.600" fontSize="sm">
          Start by providing the essential details about your listing.
        </Text>
      </Stack>

      <FormControl>
        <FormLabel>Breed</FormLabel>
        <Select
          placeholder="Select breed"
          value={data.user_breed_id || ''}
          onChange={(e) => updateData({ user_breed_id: e.target.value || undefined })}
          bg={bgColor}
        >
          {userBreeds?.map((userBreed) => (
            <option key={userBreed.id} value={userBreed.id}>
              {userBreed.breeds?.name}
            </option>
          ))}
        </Select>
        <Text fontSize="xs" color="gray.500" mt={1}>
          You can only select from the breeds you have added. To add a new breed, go to the "Manage Breeds" page.
        </Text>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Listing Type</FormLabel>
        <RadioGroup
          value={data.type}
          onChange={(value: 'litter' | 'single_pet') => updateData({ type: value })}
        >
          <VStack align="start" spacing={3}>
            <Radio value="litter" colorScheme="brand">
              <Box>
                <Text fontWeight="medium">Litter</Text>
                <Text fontSize="sm" color="gray.600">
                  Multiple puppies from the same litter
                </Text>
              </Box>
            </Radio>
            <Radio value="single_pet" colorScheme="brand">
              <Box>
                <Text fontWeight="medium">Single Pet</Text>
                <Text fontSize="sm" color="gray.600">
                  Individual dog looking for a new home
                </Text>
              </Box>
            </Radio>
          </VStack>
        </RadioGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Listing Title</FormLabel>
        <Input
          placeholder="e.g., Adorable Golden Retriever Puppies"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          bg={bgColor}
        />
        <Text fontSize="xs" color="gray.500" mt={1}>
          Choose a clear, descriptive title that highlights your pet's best qualities.
        </Text>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Describe your pet's personality, health, temperament, and any other important details..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={4}
          bg={bgColor}
        />
        <Text fontSize="xs" color="gray.500" mt={1}>
          Provide detailed information to help potential adopters make informed decisions.
        </Text>
      </FormControl>

      {/* Parents Information Section */}
      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">
                  Parents Information
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Add details about the sire and dam (optional but recommended)
                </Text>
              </Box>
              <Button size="sm" variant="outline" onClick={toggleParents}>
                {showParents ? 'Hide' : 'Show'} Parents
              </Button>
            </HStack>

            {showParents && (
              <>
                <Divider />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {/* Sire Information */}
                  <Card size="sm">
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                          Sire (Father)
                        </Text>

                        <FormControl>
                          <FormLabel fontSize="xs">Name</FormLabel>
                          <Input
                            size="sm"
                            placeholder="Sire name"
                            value={data.parents?.sire?.name || ''}
                            onChange={(e) => updateData({
                              parents: {
                                ...data.parents,
                                sire: {
                                  ...data.parents?.sire,
                                  name: e.target.value
                                }
                              }
                            })}
                            bg="white"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs">Breed</FormLabel>
                          <Input
                            size="sm"
                            placeholder="Sire breed"
                            value={data.parents?.sire?.breed || ''}
                            onChange={(e) => updateData({
                              parents: {
                                ...data.parents,
                                sire: {
                                  ...data.parents?.sire,
                                  breed: e.target.value
                                }
                              }
                            })}
                            bg="white"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs">Registration</FormLabel>
                          <Input
                            size="sm"
                            placeholder="Registration number"
                            value={data.parents?.sire?.registration || ''}
                            onChange={(e) => updateData({
                              parents: {
                                ...data.parents,
                                sire: {
                                  ...data.parents?.sire,
                                  registration: e.target.value
                                }
                              }
                            })}
                            bg="white"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Dam Information */}
                  <Card size="sm">
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <Text fontSize="sm" fontWeight="semibold" color="pink.600">
                          Dam (Mother)
                        </Text>

                        <FormControl>
                          <FormLabel fontSize="xs">Name</FormLabel>
                          <Input
                            size="sm"
                            placeholder="Dam name"
                            value={data.parents?.dam?.name || ''}
                            onChange={(e) => updateData({
                              parents: {
                                ...data.parents,
                                dam: {
                                  ...data.parents?.dam,
                                  name: e.target.value
                                }
                              }
                            })}
                            bg="white"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs">Breed</FormLabel>
                          <Input
                            size="sm"
                            placeholder="Dam breed"
                            value={data.parents?.dam?.breed || ''}
                            onChange={(e) => updateData({
                              parents: {
                                ...data.parents,
                                dam: {
                                  ...data.parents?.dam,
                                  breed: e.target.value
                                }
                              }
                            })}
                            bg="white"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="xs">Registration</FormLabel>
                          <Input
                            size="sm"
                            placeholder="Registration number"
                            value={data.parents?.dam?.registration || ''}
                            onChange={(e) => updateData({
                              parents: {
                                ...data.parents,
                                dam: {
                                  ...data.parents?.dam,
                                  registration: e.target.value
                                }
                              }
                            })}
                            bg="white"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                <Text fontSize="xs" color="gray.500">
                  💡 Adding parent information helps build trust with potential adopters and shows transparency about your breeding program.
                </Text>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
