import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Text,
  Box,
  useColorModeValue,
  Card,
  CardBody,
  Textarea,
  Input,
} from '@chakra-ui/react';
import { ListingFormData } from '.';
import { RadioCard } from 'lib/components/ui/RadioCard';
import { RadioCardGroup } from 'lib/components/ui/RadioCardGroup';

interface BasicInfoStepProps {
  data: ListingFormData;
  updateData: (updates: Partial<ListingFormData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');


  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="md" fontWeight="semibold">
          Basic Information
        </Text>
        <Text fontSize="sm" color="gray.600">
          Start by providing the essential details about your listing.
        </Text>
      </Box>
      <Card bg={bgColor} boxShadow="none">
        <CardBody>
          <VStack spacing={6} align="stretch">



            <FormControl isRequired>
              <FormLabel>Listing Type</FormLabel>
              <RadioCardGroup
                value={data.type}
                onChange={(value: 'litter' | 'single_pet') => updateData({ type: value })}
              >
                <RadioCard value="litter">
                  <Box>
                    <Text fontWeight="medium" color="emphasized" >Litter</Text>
                    <Text fontSize="sm" color="muted">
                      Multiple puppies from the same litter
                    </Text>
                  </Box>
                </RadioCard>
                <RadioCard value="single_pet" >
                  <Box>
                    <Text fontWeight="medium" color="emphasized">Single Pet</Text>
                    <Text fontSize="sm" color="muted">
                      Individual dog looking for a new home
                    </Text>
                  </Box>
                </RadioCard>
              </RadioCardGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Listing Title</FormLabel>
              <Input
                placeholder="e.g., Adorable Golden Retriever Puppies"
                value={data.title}
                onChange={(e) => updateData({ title: e.target.value })}
                bg="white"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Choose a clear, descriptive title that highlights your pet's best qualities.
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe your pet's personality, health, temperament, and any other important details..."
                value={data.description}
                onChange={(e) => updateData({ description: e.target.value })}
                rows={4}
                bg="white"
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Provide detailed information to help potential adopters make informed decisions.
              </Text>
            </FormControl>

          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
