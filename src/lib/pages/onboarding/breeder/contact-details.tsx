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
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineLocationOn, MdBusiness, MdHome, MdApartment } from "react-icons/md";
import { useCurrentUser, useUserProfile } from "../../../hooks/queries";
import { useUpdateUserProfile } from "../../../hooks/queries";
import { supabase } from "../../../supabase/client";
import { Loader } from "lib/components/ui/Loader";

type PageProps = {
  currentStep: number;
  setStep: (step: number) => void;
};

export const BreederContactDetails: React.FC<PageProps> = ({ currentStep, setStep }) => {
  const { data: user } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateUserProfile = useUpdateUserProfile();
  const toast = useToast();

  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const onBack = () => {
    setStep(currentStep - 1);
  };

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setLocation(profile.location_text);
    }
  }, [profile]);

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
      // Save universal user data to users table
      await updateUserProfile.mutateAsync({
        display_name: displayName,
        location_text: location,
      });

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

  if (profileLoading) {
    return (
      <Center h="100%">
        <Loader />
      </Center>
    );
  }


  return (
    <Stack as="form" spacing="9" onSubmit={onSubmit}>
      <Heading size={{ base: "sm", lg: "md" }}>
        Awesome! Tell us a bit about yourself.
      </Heading>

      <Stack spacing="4">
        <FormControl id="displayName">
          <FormLabel htmlFor="displayName">Your Name</FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdBusiness} color="gray.300" boxSize={5} />
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
          isDisabled={!displayName || !location}
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
