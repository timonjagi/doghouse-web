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
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useBreeds } from "../../../hooks/queries";
import { useCurrentUser } from "../../../hooks/queries";
import { useSeekerProfile, useUpsertSeekerProfile } from "../../../hooks/queries/useSeekerProfile";
import { RadioButton } from "lib/components/ui/RadioButton";
import { RadioButtonGroup } from "lib/components/ui/RadioButtonGroup";
import { Loader } from "lib/components/ui/Loader";
import breedsData from "../../../data/breeds_with_group_and_traits.json";
import { Select } from "chakra-react-select";
import { supabase } from "lib/supabase/client";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const SeekerPreferences: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const { data: breeds, isLoading: breedsLoading } = useBreeds();
  const { data: seekerProfile, isLoading: profileLoading } = useSeekerProfile(user?.id);
  const upsertSeekerProfile = useUpsertSeekerProfile();
  const toast = useToast();

  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [preferredAge, setPreferredAge] = useState<string>("");
  const [preferredSex, setPreferredSex] = useState<string>("");
  const [spayNeuterPreference, setSpayNeuterPreference] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Use local breeds data for better performance
  const breedOptions = breedsData.map((breed) => ({
    label: breed.name,
    value: breed.name, // Use name as value for selection
    breed: breed,
  }));

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

  useEffect(() => {
    if (seekerProfile) {
      if (seekerProfile.preferred_breed_name) {
        const breed = breedsData.find((b) => b.name === seekerProfile.preferred_breed_name);
        setSelectedBreed(breed);
      }

      if (seekerProfile.preferred_age) {
        setPreferredAge(seekerProfile.preferred_age);
      }
      if (seekerProfile.preferred_sex) {
        setPreferredSex(seekerProfile.preferred_sex);
      }
      if (seekerProfile.spay_neuter_preference) {
        setSpayNeuterPreference(seekerProfile.spay_neuter_preference);
      }
      if (seekerProfile.activity_level) {
        setActivityLevel(seekerProfile.activity_level);
      }
    }
  }, [seekerProfile]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !selectedBreed || !preferredAge || !preferredSex || !spayNeuterPreference || !activityLevel) {
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

      const { data: dbBreed, error: findError } = await supabase
        .from('breeds')
        .select('id')
        .eq('name', selectedBreed.name)
        .single();

      if (findError) throw new Error(`Breed not found: ${selectedBreed.name}`);


      await upsertSeekerProfile.mutateAsync({
        preferred_breed_id: dbBreed.id,
        preferred_breed_name: selectedBreed.name,
        preferred_age: preferredAge,
        preferred_sex: preferredSex,
        spay_neuter_preference: spayNeuterPreference,
        activity_level: activityLevel,
      });


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
  if (profileLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (

    <>
      {profileLoading && <Center h="100%">
        <Loader />
      </Center>}

      <Stack as="form" spacing={{ base: 6, md: 9 }} onSubmit={onSubmit}>
        <Heading size={{ base: "sm", lg: "md" }}>
          Tell us about your ideal furry friend 🐕
        </Heading>

        <Stack spacing={{ base: 3, md: 4 }}>
          <FormControl>
            <FormLabel htmlFor="breed" fontWeight="semibold">
              Preferred Breed
            </FormLabel>
            <Select
              size="md"
              placeholder="Select breed..."
              colorScheme="brand"
              options={breedOptions}
              value={selectedBreed ? { label: selectedBreed.name, value: selectedBreed.id } : null}
              onChange={onSelectBreed}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="age" fontWeight="semibold">
              Preferred Age
            </FormLabel>
            <RadioGroup
              size="md"
              value={preferredAge}
              onChange={setPreferredAge}
              colorScheme="brand"

            >
              <Stack>
                {ageOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <Text fontSize="sm" fontWeight={preferredAge === option.value ? "semibold" : "normal"}>
                      {option.label}
                    </Text>
                  </Radio>
                ))}
              </Stack>

            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="sex" fontWeight="semibold">
              Preferred Sex
            </FormLabel>
            <RadioGroup
              size="md"
              value={preferredSex}
              onChange={setPreferredSex}
              colorScheme="brand"
            >
              <Stack>
                {sexOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <Text fontSize="sm" fontWeight={preferredSex === option.value ? "semibold" : "normal"}>
                      {option.label}
                    </Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="spayNeuter" fontWeight="semibold">
              Spay/Neuter Preference
            </FormLabel>

            <RadioGroup
              size="md"
              value={spayNeuterPreference}
              onChange={setSpayNeuterPreference}
              colorScheme="brand"
            >
              <Stack>
                {spayNeuterOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <Text fontSize="sm" fontWeight={spayNeuterPreference === option.value ? "semibold" : "normal"}>
                      {option.label}
                    </Text>
                  </Radio>
                ))}
              </Stack>

            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="activityLevel" fontWeight="semibold">
              Activity Level
            </FormLabel>
            <RadioGroup
              size="md"
              value={activityLevel}
              onChange={setActivityLevel}
              colorScheme="brand"
            >
              <Stack>
                {activityOptions.map((option) => (
                  <Radio fontSize="sm" key={option.value} value={option.value}>
                    <Text fontSize="sm" fontWeight={activityLevel === option.value ? "semibold" : "normal"}>
                      {option.label}
                    </Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
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
            isDisabled={loading}
          >
            Next
          </Button>
        </ButtonGroup>
      </Stack>
    </>

  );
};
