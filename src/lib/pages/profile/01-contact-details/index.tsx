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
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { MdOutlineLocationOn } from "react-icons/md";

import { auth, fireStore } from "lib/firebase/client";
import { Dropzone } from "lib/components/Dropzone";

type PageProps = {
  currentStep: number;
  // eslint-disable-next-line
  setStep: any;
};

export const ContactDetails = ({ currentStep, setStep }: PageProps) => {
  const [user] = useAuthState(auth);
  const toast = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateProfile] = useUpdateProfile(auth);

  const assignBreederRole = async (uid: string) => {
    try {
      const response = await fetch("/api/users/set-custom-claims", {
        method: "POST",
        body: JSON.stringify({ uid, isBreeder: true }),
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
      await updateProfile({ displayName });

      const payload = {
        userId: user?.uid,
        name: displayName,
        location: location,
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
      <Heading size="md">Hi there! Please tell us a bit about yourself</Heading>

      <Stack spacing="6">
        <FormControl id="name">
          <FormLabel htmlFor="name">Your Name</FormLabel>
          <Input
            size="lg"
            required
            id="userName"
            name="userName"
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone">Your Location</FormLabel>

          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              required
              id="location"
              name="location"
              placeholder="Enter your location"
              type="text"
              onChange={(event) => setLocation(event?.target.value)}
            />{" "}
          </InputGroup>
        </FormControl>

        <FormControl id="file">
          <FormLabel>Upload profile photo</FormLabel>
        </FormControl>
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
        {/* <Button
          onClick={() => onBack}
          isDisabled={currentStep === 0}
          variant="ghost"
        >
          Back
        </Button> */}
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
