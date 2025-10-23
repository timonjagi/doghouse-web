import {
  Stack,
  FormControl,
  FormLabel,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Heading,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCurrentUser, useUpdateUserProfile } from "../../../hooks/queries";
import { useSeekerProfile, useUpsertSeekerProfile } from "../../../hooks/queries/useSeekerProfile";
import { RadioButton } from "lib/components/ui/RadioButton";
import { RadioButtonGroup } from "lib/components/ui/RadioButtonGroup";
import { Text } from "@chakra-ui/react";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const SeekerLivingSituation: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const upsertSeekerProfile = useUpsertSeekerProfile();
  const { data: seekerProfile, isLoading: profileLoading } = useSeekerProfile(user?.id);

  const toast = useToast();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfile();

  const [livingSituation, setLivingSituation] = useState("");
  const [hasAllergies, setHasAllergies] = useState<string>("");
  const [hasChildren, setHasChildren] = useState<string>("");
  const [hasOtherPets, setHasOtherPets] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const livingSituationOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "compound", label: "Compound with yard" },
    { value: "farm", label: "Farm/Rural property" },
  ];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  useEffect(() => {
    if (seekerProfile) {
      setLivingSituation(seekerProfile.living_situation);
      setHasAllergies(seekerProfile.has_allergies ? "yes" : "no");
      setHasChildren(seekerProfile.has_children ? "yes" : "no");
      setHasOtherPets(seekerProfile.has_other_pets ? "yes" : "no");
    }
  }, [seekerProfile]);

  const onBack = () => {
    setStep(currentStep - 1);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Save living situation and household info to seeker_profiles table
      await upsertSeekerProfile.mutateAsync({
        living_situation: livingSituation,
        has_allergies: hasAllergies === "yes",
        has_children: hasChildren === "yes",
        has_other_pets: hasOtherPets === "yes",
      });

      await updateUserProfile({
        onboarding_completed: true,
      });

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving living situation",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Stack as="form" spacing={{ base: 6, md: 9 }} onSubmit={onSubmit}>
      <Heading size="md">
        Tell us about your living situation 🏡
      </Heading>

      {/* <Text fontSize="md" color="gray.600">
        Help us understand your home environment for the best dog match.
      </Text> */}

      <Stack spacing={{ base: 3, md: 4 }}>
        <FormControl id="livingSituation">
          <FormLabel htmlFor="livingSituation" fontWeight="semibold">
            Living Situation
          </FormLabel>
          <Select
            size="md"
            placeholder="Select your living situation"
            value={livingSituation}
            onChange={(e) => setLivingSituation(e.target.value)}
          >
            {livingSituationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                <Text size="sm">{option.label}</Text>
              </option>
            ))}
          </Select>
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
          isDisabled={!livingSituation || !hasAllergies || !hasChildren || !hasOtherPets}
        >
          Complete Setup
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
