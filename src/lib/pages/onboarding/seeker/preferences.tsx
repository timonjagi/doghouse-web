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
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useBreeds } from "../../../hooks/queries";
import { useCurrentUser } from "../../../hooks/queries";
import { useUpsertSeekerProfile } from "../../../hooks/queries/useSeekerProfile";
import { RadioButton } from "lib/components/ui/RadioButton";
import { RadioButtonGroup } from "lib/components/ui/RadioButtonGroup";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const SeekerPreferences: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const { data: breeds, isLoading: breedsLoading } = useBreeds();
  const upsertSeekerProfile = useUpsertSeekerProfile();
  const toast = useToast();

  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [preferredAge, setPreferredAge] = useState<string>("");
  const [preferredSex, setPreferredSex] = useState<string>("");
  const [spayNeuterPreference, setSpayNeuterPreference] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [hasAllergies, setHasAllergies] = useState<string>("");
  const [hasChildren, setHasChildren] = useState<string>("");
  const [hasOtherPets, setHasOtherPets] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const ageOptions = [
    { value: "puppy", label: "Puppy (under 1 year)" },
    { value: "adolescent", label: "Adolescent (1-2 years)" },
    { value: "adult", label: "Adult (2+ years)" },
  ];

  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "either", label: "No preference" },
  ];

  const spayNeuterOptions = [
    { value: "yes", label: "Already spayed/neutered preferred" },
    { value: "no", label: "Will spay/neuter myself" },
    { value: "unsure", label: "Unsure/No preference" },
  ];

  const activityOptions = [
    { value: "low", label: "Low energy (couch potato)" },
    { value: "moderate", label: "Moderate energy (daily walks)" },
    { value: "high", label: "High energy (very active)" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const onBack = () => {
    setStep(currentStep - 1);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !selectedBreed) {
      toast({
        title: "Selection required",
        description: "Please select a breed and your preferences",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Save seeker profile preferences to seeker_profiles table
      await upsertSeekerProfile.mutateAsync({
        has_allergies: hasAllergies === "yes",
        has_children: hasChildren === "yes",
        has_other_pets: hasOtherPets === "yes",
      });

      // Store preferences in sessionStorage for wanted_listings creation
      const preferences = {
        selectedBreed,
        preferredAge,
        preferredSex,
        spayNeuterPreference,
        activityLevel,
        hasAllergies: hasAllergies === "yes",
        hasChildren: hasChildren === "yes",
        hasOtherPets: hasOtherPets === "yes",
      };

      sessionStorage.setItem("seekerPreferences", JSON.stringify(preferences));

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving preferences",
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
        Tell us about your ideal furry friend 🐕
      </Heading>

      <Text fontSize="md" color="gray.600">
        Help us find the perfect match for your lifestyle and preferences.
      </Text>

      <Stack spacing={{ base: 3, md: 4 }}>
        <FormControl>
          <FormLabel htmlFor="breed" fontWeight="semibold">
            Preferred Breed
          </FormLabel>
          <Select
            size="lg"
            placeholder="Select your preferred breed..."
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            {breeds?.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="age" fontWeight="semibold">
            Preferred Age
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={preferredAge}
            onChange={setPreferredAge}
          >
            {ageOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={preferredAge === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="sex" fontWeight="semibold">
            Preferred Sex
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={preferredSex}
            onChange={setPreferredSex}
          >
            {sexOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={preferredSex === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="spayNeuter" fontWeight="semibold">
            Spay/Neuter Preference
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={spayNeuterPreference}
            onChange={setSpayNeuterPreference}
          >
            {spayNeuterOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={spayNeuterPreference === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="activityLevel" fontWeight="semibold">
            Activity Level
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={activityLevel}
            onChange={setActivityLevel}
          >
            {activityOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={activityLevel === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="allergies" fontWeight="semibold">
            Do you or anyone in your household have allergies?
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={hasAllergies}
            onChange={setHasAllergies}
          >
            {yesNoOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={hasAllergies === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="children" fontWeight="semibold">
            Do you have children at home?
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={hasChildren}
            onChange={setHasChildren}
          >
            {yesNoOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={hasChildren === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="otherPets" fontWeight="semibold">
            Do you have other pets at home?
          </FormLabel>
          <RadioButtonGroup
            size="md"
            value={hasOtherPets}
            onChange={setHasOtherPets}
          >
            {yesNoOptions.map((option) => (
              <RadioButton key={option.value} value={option.value}>
                <Text fontWeight={hasOtherPets === option.value ? "semibold" : "normal"}>
                  {option.label}
                </Text>
              </RadioButton>
            ))}
          </RadioButtonGroup>
        </FormControl>
      </Stack>

      <ButtonGroup width="100%">
        <Button onClick={onBack} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          variant="primary"
          isDisabled={!selectedBreed || !preferredAge || !preferredSex}
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
