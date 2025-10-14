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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineLocationOn, MdPerson, MdPersonOutline } from "react-icons/md";
import { useCurrentUser } from "../../../hooks/queries";
import { useUpdateUserProfile } from "../../../hooks/queries";
import { supabase } from "../../../supabase/client";

type PageProps = {
  currentStep: number;
  // eslint-disable-next-line
  setStep: any;
};

export const ContactDetails = ({ currentStep, setStep }: PageProps) => {
  const { data: user } = useCurrentUser();
  const updateUserProfile = useUpdateUserProfile();
  const toast = useToast();
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Get user role from user metadata
  const userRole = user?.user_metadata?.role;

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
      // Update user profile in Supabase using React Query mutation
      await updateUserProfile.mutateAsync({
        display_name: displayName,
        location: location,
      });

      setStep(currentStep + 1);
    } catch (err: any) {
      toast({
        title: "Error saving contact details",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  // const onBack = () => {
  //   setStep(currentStep - 1);
  // };

  return (
    <Stack as="form" spacing="9" onSubmit={(event) => onSubmit(event)}>
      <Heading size="md">
        {userRole === "seeker"
          ? "Great! Please tell us a bit about yourself"
          : "Great! Please tell us a bit about your kennel"}
      </Heading>

      <Stack spacing="4">
        <FormControl id="name">
          <FormLabel htmlFor="name">Name</FormLabel>

          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdPersonOutline} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              size="lg"
              required
              id="userName"
              name="userName"
              type="text"
              placeholder={
                userRole === "seeker"
                  ? "Your name"
                  : "Your kennel's name"
              }
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone">Location</FormLabel>

          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              required
              id="location"
              name="location"
              placeholder={
                userRole === "seeker"
                  ? "Your location"
                  : "Your kennel's location"
              }
              type="text"
              onChange={(event) => setLocation(event?.target.value)}
            />{" "}
          </InputGroup>
        </FormControl>

        {/* <FormControl id="file">
          <FormLabel>Upload profile photo</FormLabel>
        </FormControl> */}
        {/* <FormControl>
          <FormLabel htmlFor="phone">Your Email (optional)</FormLabel>

          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              required
              id="location"
              name="location"
              placeholder="Enter your email"
              type="email"
              onChange={(event) => setEmail(event?.target.value)}
            />{" "}
          </InputGroup>
        </FormControl> */}
      </Stack>

      <ButtonGroup width="100%">
        <Button onClick={onBack} isDisabled={currentStep === 0} variant="ghost">
          Back
        </Button>
        <Spacer />
        <Button
          isLoading={loading}
          type="submit"
          isDisabled={currentStep >= 3}
          variant="primary"
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
