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
import { supabase } from "lib/supabase/client";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { Dropzone } from "lib/components/ui/Dropzone";
import { UserProfile } from "lib/models/user-profile";

type PageProps = {
  currentStep: number;
  // eslint-disable-next-line
  setStep: any;
};

export const ContactDetails = ({ currentStep, setStep }: PageProps) => {
  const { user } = useSupabaseAuth();
  const toast = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({} as any);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    setUserProfile(profile);
  }, []);

  const onBack = () => {
    setStep(currentStep - 1);
  };

  const assignBreederRole = async (uid: string) => {
    try {
      const response = await fetch("/api/users/set-custom-claims", {
        method: "POST",
        body: JSON.stringify({
          uid,
          isOwner: userProfile.roles.includes("dog_owner") ? true : false,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setStep(currentStep + 1);
      }
      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (user) {
        // Update user profile in Supabase
        const { error: updateError } = await supabase
          .from('users')
          .update({
            display_name: displayName,
            location_text: location,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        }

        // Update role if needed (this would need to be handled differently in Supabase)
        // await assignBreederRole(user.id);
      }

      const payload = {
        userId: user?.id,
        name: displayName,
        location: location,
        ...userProfile,
      };

      await localStorage.setItem("profile", JSON.stringify(payload));

      setStep(currentStep + 1);

      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
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
        {userProfile?.roles?.includes("dog_seeker")
          ? "Great! Please tell us a bit about yourself"
          : "Great! Please tell us a bit about kennel"}
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
                userProfile?.roles?.includes("dog_seeker")
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
                userProfile?.roles?.includes("dog_seeker")
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
