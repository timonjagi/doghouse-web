import {
  Stack,
  FormControl,
  FormLabel,
  Text,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useBreeds, useCreateUserBreed } from "../../../hooks/queries";
import { useCurrentUser } from "../../../hooks/queries";
import { Select } from "chakra-react-select";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreedSelection: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();

  const { data: breeds, isLoading: breedsLoading } = useBreeds();

  const breedOptions = breeds?.map((breed) => ({
    label: breed.name,
    value: breed.id,
    breed: breed,
  })) || [];

  const addUserBreed = useCreateUserBreed();
  const toast = useToast();

  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onSelectBreed = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedBreed(selectedOption.breed);
    } else {
      setSelectedBreed(null);
    }
  };


  const onBack = () => {
    setStep(currentStep - 1);
  };


  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !selectedBreed) {
      toast({
        title: "Selection required",
        description: "Please select at least one breed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Save selected breeds to user_breeds table
      await addUserBreed.mutateAsync(selectedBreed.id);

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving breed selection",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  // Show loading spinner while fetching breeds
  if (breedsLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Stack as="form" spacing={{ base: 6, md: 9 }} onSubmit={onSubmit}>
      <Heading size="md">
        Which breeds do you specialize in? 🐕
      </Heading>

      <Text fontSize="md" color="gray.600">
        Select all the breeds you currently breed or plan to breed. You can always add more later.
      </Text>

      <FormControl>
        <FormLabel htmlFor="breeds" fontWeight="semibold">
          Breed
        </FormLabel>
        <Select
          placeholder="Select breed..."
          colorScheme="brand"
          options={breedOptions}
          value={selectedBreed ? { label: selectedBreed.name, value: selectedBreed.id } : null}
          onChange={onSelectBreed}
        />
      </FormControl>


      <Text fontSize="sm" color="subtle" textAlign="start">Have
        multiple breeds? That's awesome! You can add additional breeds later.
      </Text>
      <ButtonGroup width="100%">
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          variant="primary"
          isDisabled={!selectedBreed}
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
