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
import { useAuthState } from "react-firebase-hooks/auth";
import { MdOutlineLocationOn } from "react-icons/md";

import { auth, fireStore } from "lib/firebase/client";

// eslint-disable-next-line
export const Step2 = ({ currentStep, setStep }: any) => {
  const [user] = useAuthState(auth);
  const toast = useToast();

  const [kennelName, setKennelName] = useState("");
  const [kennelLocation, setKennelLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    try {
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

  return (
    <Stack as="form" spacing="5" mt="5" onSubmit={(event) => onSubmit(event)}>
      <Stack spacing="3">
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
              placeholder="Enter you kennel's location"
              type="string"
              onChange={(event) => setKennelLocation(event?.target.value)}
            />{" "}
          </InputGroup>
        </FormControl>
      </Stack>

      <ButtonGroup width="100%">
        <Button
          onClick={() => setStep(currentStep - 1)}
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
