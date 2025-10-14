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
} from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlineLocationOn, MdBusiness, MdHome, MdApartment } from "react-icons/md";
import { useCurrentUser } from "../../../hooks/queries";
import { useUpdateUserProfile } from "../../../hooks/queries";
import { useUpsertBreederProfile } from "../../../hooks/queries/useBreederProfile";
import { supabase } from "../../../supabase/client";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreederContactDetails: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const updateUserProfile = useUpdateUserProfile();
  const upsertBreederProfile = useUpsertBreederProfile();
  const toast = useToast();

  const [kennelName, setKennelName] = useState("");
  const [kennelLocation, setKennelLocation] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const facilityOptions = [
    { value: "home_based", label: "Home-based", icon: MdHome },
    { value: "dedicated_facility", label: "Dedicated Facility", icon: MdBusiness },
    { value: "mixed", label: "Mixed", icon: MdApartment },
  ];

  const experienceOptions = [
    { value: "first_time", label: "First Time Breeder" },
    { value: "experienced", label: "Experienced Breeder" },
    { value: "professional", label: "Professional Breeder" },
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
      // Save to both users table (universal data) and breeder_profiles table (role-specific data)
      await Promise.all([
        // Save universal user data to users table
        updateUserProfile.mutateAsync({
          display_name: kennelName, // Use kennel name as display name for breeders
          location: kennelLocation,
        }),
        // Save breeder-specific data to breeder_profiles table
        upsertBreederProfile.mutateAsync({
          kennel_name: kennelName,
          kennel_location: kennelLocation,
          facility_type: facilityType,
        }),
      ]);

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving kennel information",
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
        Great choice! Let's set up your kennel information 🏠
      </Heading>

      <Stack spacing="4">
        <FormControl id="kennelName">
          <FormLabel htmlFor="kennelName">Kennel Name</FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdBusiness} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              size="lg"
              required
              id="kennelName"
              name="kennelName"
              type="text"
              placeholder="Your kennel's name"
              value={kennelName}
              onChange={(e) => setKennelName(e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <FormControl id="kennelLocation">
          <FormLabel htmlFor="kennelLocation">Kennel Location</FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              size="lg"
              required
              id="kennelLocation"
              name="kennelLocation"
              placeholder="City, Country"
              value={kennelLocation}
              onChange={(e) => setKennelLocation(e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <FormControl id="facilityType">
          <FormLabel htmlFor="facilityType">Facility Type</FormLabel>
          <Select
            size="lg"
            placeholder="Select your facility type"
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
          >
            {facilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="experienceLevel">
          <FormLabel htmlFor="experienceLevel">Experience Level</FormLabel>
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
          isDisabled={!kennelName || !kennelLocation || !facilityType}
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
