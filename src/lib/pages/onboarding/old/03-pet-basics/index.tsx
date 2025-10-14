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
import React, { useEffect, useState } from "react";
import { Select } from "chakra-react-select";

import { useBreeds, useAddUserBreed } from "../../../../hooks/queries";
import { useCurrentUser } from "../../../../hooks/queries";
import { RadioButton } from "lib/components/ui/RadioButton";
import { RadioButtonGroup } from "lib/components/ui/RadioButtonGroup";

// eslint-disable-next-line
export const PetBasics = ({ currentStep, setStep }: any) => {
  const { data: user } = useCurrentUser();
  const { data: breeds, isLoading: breedsLoading } = useBreeds();
  const addUserBreed = useAddUserBreed();
  const toast = useToast();

  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Get user role from user metadata
  const userRole = user?.user_metadata?.role;

  // Transform breeds data for the Select component
  const breedOptions = breeds?.map((breed) => ({
    label: breed.name,
    value: breed.id,
    breed: breed,
  })) || [];

  const onSelectBreed = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedBreed(selectedOption.breed);
    } else {
      setSelectedBreed(null);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !selectedBreed) {
      toast({
        title: "Missing information",
        description: "Please select a breed and preferences",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // For breeders, save the breed to user_breeds table
      if (userRole === "breeder") {
        await addUserBreed.mutateAsync(selectedBreed.id);
      }
      // For seekers, we could save preferences, but for now we'll just proceed

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving breed preferences",
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
    <Stack
      as="form"
      spacing={{ base: 6, md: 9 }}
      onSubmit={(event) => onSubmit(event)}
    >
      <Heading size="md">
        Awesome!{" "}
        {userRole === "seeker"
          ? "Tell us about your ideal furry friend"
          : "Tell us about one of your amazing breeds"}
        {" 🐶"}
      </Heading>

      <Stack spacing={{ base: 3, md: 4 }}>
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

        <FormControl>
          <FormLabel htmlFor="sex" fontWeight="semibold">
            {userRole === "seeker"
              ? "Preferred Sex/Gender"
              : "Sex/Gender"}
          </FormLabel>

          <RadioButtonGroup
            key="sex"
            size="md"
            value={selectedSex}
            onChange={setSelectedSex}
          >
            <RadioButton value="male">
              <Text
                fontWeight={selectedSex === "male" ? "semibold" : "normal"}
              >
                Male
              </Text>
            </RadioButton>
            <RadioButton value="female">
              <Text
                fontWeight={
                  selectedSex === "female" ? "semibold" : "normal"
                }
              >
                Female
              </Text>
            </RadioButton>
            <RadioButton
              value={
                userRole === "seeker"
                  ? "either"
                  : "both"
              }
            >
              <Text
                fontWeight={
                  ["both", "either"].includes(selectedSex)
                    ? "semibold"
                    : "normal"
                }
              >
                {userRole === "seeker"
                  ? "No preference"
                  : "Both"}
              </Text>
            </RadioButton>
          </RadioButtonGroup>
        </FormControl>
      </Stack>

      <Text fontSize="sm" color="subtle" textAlign="start">
        {userRole === "breeder" ? "Have" : "Want"}{" "}
        multiple breeds? That's awesome! You can create additional{" "}
        {userRole === "breeder" ? "profiles" : "listings"}{" "}
        later.
      </Text>
      <ButtonGroup width="100%" mb="4">
        <Button
          onClick={() => setStep(currentStep - 1)}
          isDisabled={currentStep === 0}
          variant="ghost"
        >
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          isDisabled={!selectedBreed}
          variant="primary"
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
