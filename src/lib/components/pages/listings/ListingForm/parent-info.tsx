import { Card, CardBody, VStack, HStack, Box, Button, Divider, SimpleGrid, FormControl, FormLabel, Input, Text, useColorModeValue, Select } from '@chakra-ui/react'
import Link from 'next/link';
import React from 'react'

function ParentInfoStep({ data, updateData, userBreeds }) {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">

      <Box>
        <Text fontSize="lg" fontWeight="semibold">
          Parents Information
        </Text>
        <Text fontSize="sm" color="gray.600">
          Add details about the sire and dam (optional)
        </Text>
      </Box>


      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="brand.600">
                Sire (Father)
              </Text>
              <Text fontSize="sm" color="gray.600">
                Provide information about the sire (father)
              </Text>
            </Box>
            <FormControl>
              <FormLabel fontSize="xs">Name</FormLabel>
              <Input
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
              <Select
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
              >
                {userBreeds?.map((userBreed) => (
                  <option key={userBreed.id} value={userBreed.breeds?.name}>
                    {userBreed.breeds?.name}
                  </option>
                ))}
              </Select>

              <Text fontSize="xs" color="gray.500" mt={1}>
                You can only select from the breeds you have added. To add a new breed, go to the <Text as={Link} color="brand.600" cursor="pointer" href="/dashboard/breeds">Manage Breeds</Text> page.
              </Text>

            </FormControl>

            <FormControl>
              <FormLabel fontSize="xs">Registration </FormLabel>
              <Input
                placeholder="Registration number (optional)"
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

      <Card bg={bgColor}>
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Box>
              <Text fontSize="md" fontWeight="semibold" color="brand.600">
                Dam (Mother)
              </Text>
              <Text fontSize="sm" color="gray.600">
                Provide information about the dam (mother)
              </Text>
            </Box>
            <FormControl>
              <FormLabel fontSize="xs">Name</FormLabel>
              <Input
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

              <Select
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
              >
                {userBreeds?.map((userBreed) => (
                  <option key={userBreed.id} value={userBreed.breeds?.name}>
                    {userBreed.breeds?.name}
                  </option>
                ))}
              </Select>

              <Text fontSize="xs" color="gray.500" mt={1}>
                You can only select from the breeds you have added. To add a new breed, go to the <Text as={Link} color="brand.600" cursor="pointer" href="/dashboard/breeds">Manage Breeds</Text> page.
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="xs">Registration </FormLabel>
              <Input
                placeholder="Registration number (optional)"
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


      <Text fontSize="xs" color="gray.500">
        💡 Adding parent information helps build trust with potential adopters and shows transparency about your breeding program.
      </Text>
    </VStack>
  )
}

export default ParentInfoStep