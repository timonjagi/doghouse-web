import { Card, CardBody, VStack, Box, Divider, FormControl, HStack, Switch, Text, Select, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

function RequirementsStep({ data, updateData }: any) {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold">
          Adoption Requirements
        </Text>
        <Text fontSize="sm" color="gray.600">
          Set requirements for potential adopters (optional)
        </Text>
      </Box>

      <Card bg={bgColor} >
        <CardBody>
          <VStack spacing={4} align="stretch">

            <VStack spacing={4} align="stretch">
              <FormControl>
                <HStack justify="space-between" w="full">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Contract Required</Text>
                    <Text fontSize="xs" color="gray.500">
                      Require adopters to sign an adoption contract
                    </Text>
                  </Box>
                  <Switch
                    isChecked={data.requirements?.contract || false}
                    onChange={(e) => updateData({
                      requirements: {
                        ...data.requirements,
                        contract: e.target.checked
                      }
                    })}
                    colorScheme='brand'
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <HStack justify="space-between" w="full">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Experience Required</Text>
                    <Text fontSize="xs" color="gray.500">
                      Require adopters to have prior pet ownership experience
                    </Text>
                  </Box>
                  <Switch
                    isChecked={data.requirements?.experience || false}
                    onChange={(e) => updateData({
                      requirements: {
                        ...data.requirements,
                        experience: e.target.checked
                      }
                    })}
                    colorScheme='brand'
                  />
                </HStack>
              </FormControl>



              <FormControl>
                <HStack justify="space-between" w="full">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Yard Required</Text>
                    <Text fontSize="xs" color="gray.500">
                      Require adopters to have a yard
                    </Text>
                  </Box>
                  <Switch

                    isChecked={data.requirements?.yard || false}
                    onChange={(e) => updateData({
                      requirements: {
                        ...data.requirements,
                        yard: e.target.checked
                      }
                    })}
                    colorScheme='brand'
                  />
                </HStack>
              </FormControl>


              <FormControl>
                <HStack justify="space-between" w="full">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">Home Check Required</Text>
                    <Text fontSize="xs" color="gray.500">
                      Require a home visit before adoption
                    </Text>
                  </Box>
                  <Switch
                    isChecked={data.requirements?.homeCheck || false}
                    onChange={(e) => updateData({
                      requirements: {
                        ...data.requirements,
                        homeCheck: e.target.checked
                      }
                    })}
                    colorScheme='brand'
                  />
                </HStack>
              </FormControl>

              <FormControl>
                <Box mb={2}>
                  <Text fontSize="sm" fontWeight="semibold">Other Pets Policy</Text>
                  <Text fontSize="xs" color="gray.500" >
                    Specify your policy regarding other pets in the adopter's home
                  </Text>
                </Box>

                <Select
                  placeholder="Select policy"
                  value={data.requirements?.otherPets || ''}
                  onChange={(e) => updateData({
                    requirements: {
                      ...data.requirements,
                      otherPets: e.target.value as any
                    }
                  })}
                  bg={bgColor}
                  colorScheme="brand"
                  size="sm"

                >
                  <option value="allowed">Other pets allowed</option>
                  <option value="no-dogs">No dogs allowed</option>
                  <option value="no-cats">No cats allowed</option>
                  <option value="none">No other pets</option>
                </Select>
              </FormControl>


              <FormControl>
                <Box mb={2}>
                  <Text fontSize="sm" fontWeight="semibold">Children Policy</Text>
                  <Text fontSize="xs" color="gray.500" >
                    Specify your policy regarding children in the adopter's home
                  </Text>
                </Box>

                <Select
                  placeholder="Select policy"
                  value={data.requirements?.children || ''}
                  onChange={(e) => updateData({
                    requirements: {
                      ...data.requirements,
                      children: e.target.value as any
                    }
                  })}
                  bg={bgColor}
                  colorScheme="brand"
                  size="sm"

                >
                  <option value="allowed">Children allowed</option>
                  <option value="no-young-children">No young children</option>
                  <option value="none">No children</option>
                </Select>
              </FormControl>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}

export default RequirementsStep