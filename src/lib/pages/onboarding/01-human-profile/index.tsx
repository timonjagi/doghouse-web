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
} from "@chakra-ui/react";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { MdOutlineLocationOn } from "react-icons/md";

import { auth, fireStore } from "lib/firebase/client";

type PageProps = {
  currentStep: number;
  // eslint-disable-next-line
  setStep: any;
};

export const HumanProfile = ({ currentStep, setStep }: PageProps) => {
  const [user] = useAuthState(auth);
  const toast = useToast();

  const [displayName, setDisplayName] = useState("");
  const [kennelName, setKennelName] = useState("");
  const [kennelLocation, setKennelLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateProfile] = useUpdateProfile(auth);

  const assignBreederRole = async (uid: string) => {
    try {
      const response = await fetch("/api/set-custom-claims", {
        method: "POST",
        body: JSON.stringify({ uid, isBreeder: true }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // await createUserDocument(uid);
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
        breederId: user?.uid,
        name: kennelName,
        location: kennelLocation,
      };

      await addDoc(collection(fireStore, "kennels"), payload);
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

  const onBack = () => {
    setStep(currentStep - 1);
  };

  return (
    <Stack as="form" spacing="5" mt="5" onSubmit={(event) => onSubmit(event)}>
      <Stack spacing="3">
        <FormControl id="name">
          <FormLabel htmlFor="name">Your Name</FormLabel>
          <Input
            required
            id="userName"
            name="userName"
            type="text"
            placeholder="Enter the your name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </FormControl>

        <FormControl id="name">
          <FormLabel htmlFor="name">Kennel Name</FormLabel>
          <Input
            required
            id="kennelName"
            name="kennelName"
            type="text"
            placeholder="Enter the name of your kennel"
            onChange={(e) => setKennelName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone">Location</FormLabel>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={MdOutlineLocationOn} color="gray.300" boxSize={5} />
            </InputLeftElement>
            <Input
              required
              id="location"
              name="location"
              placeholder="Enter your kennel's location"
              type="string"
              onChange={(event) => setKennelLocation(event?.target.value)}
            />{" "}
          </InputGroup>
        </FormControl>
      </Stack>

      <ButtonGroup width="100%">
        <Button
          onClick={() => onBack}
          isDisabled={currentStep === 0}
          variant="ghost"
        >
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
