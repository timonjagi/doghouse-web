import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
  Button,
  Spacer,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
  Heading,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlineLocationOn, MdPerson, MdHome, MdApartment } from "react-icons/md";
import { useCurrentUser } from "../../../hooks/queries";
import { useUpdateUserProfile } from "../../../hooks/queries";
import { useUpsertSeekerProfile } from "../../../hooks/queries/useSeekerProfile";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const SeekerContactDetails: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const updateUserProfile = useUpdateUserProfile();
  const upsertSeekerProfile = useUpsertSeekerProfile();
  const toast = useToast();

  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const livingSituationOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "compound", label: "Compound with yard" },
    { value: "farm", label: "Farm/Rural property" },
  ];

  const experienceOptions = [
    { value: "first_time", label: "First time dog owner" },
    { value: "some_experience", label: "Some experience with dogs" },
    { value: "experienced", label: "Experienced dog owner" },
    { value: "professional", label: "Professional (vet, trainer, etc.)" },
  ];

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
      // Save to both users table (universal data) and seeker_profiles table (role-specific data)
      await Promise.all([
        // Save universal user data to users table
        updateUserProfile.mutateAsync({
          display_name: displayName,
          location_text: location,
        }),
        // Save seeker-specific data to seeker_profiles table
        upsertSeekerProfile.mutateAsync({
          living_situation: livingSituation,
          experience_level: experienceLevel,
        }),
      ]);

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving personal information",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Stack as="form" spacing="9" onSubmit={onSubmit}>
      <Heading size="md">
        Great choice! Tell us about yourself 🏠
      </Heading>

      <Stack spacing="4">
        <FormControl id="displayName">
          <FormLabel htmlFor="displayName">Your Name</FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdPerson} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              size="lg"
              required
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Your full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <FormControl id="location">
          <FormLabel htmlFor="location">Location</FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              size="lg"
              required
              id="location"
              name="location"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <FormControl id="livingSituation">
          <FormLabel htmlFor="livingSituation">Living Situation</FormLabel>
          <Select
            size="lg"
            placeholder="Select your living situation"
            value={livingSituation}
            onChange={(e) => setLivingSituation(e.target.value)}
          >
            {livingSituationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="experienceLevel">
          <FormLabel htmlFor="experienceLevel">Experience with Dogs</FormLabel>
          <Select
            size="lg"
            placeholder="Select your experience level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            {experienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
          isDisabled={!displayName || !location || !livingSituation || !experienceLevel}
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
