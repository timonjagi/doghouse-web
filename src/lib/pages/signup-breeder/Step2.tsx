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
import Select from "react-select";

import { auth, fireStore } from "lib/firebase/client";

// eslint-disable-next-line
export const Step2 = ({ currentStep, setStep }: any) => {
  const [user] = useAuthState(auth);
  const toast = useToast();
  const services = [
    { label: "Adoption", value: "adoption" },
    { label: "Stud", value: "stud" },
    { label: "Exchange", value: "exchange" },
    { label: "Boarding", value: "boarding" },
  ];

  const [kennelName, setKennelName] = useState("");
  const [kennelLocation, setKennelLocation] = useState("");
  const [kennelServices, setKennelServices] = useState([] as string[]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line
  const onSelectServices = (selectedService: any) => {
    if (selectedService) {
      setKennelServices((prev) => [...prev, selectedService.value]);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    try {
      const payload = {
        breederId: user?.uid,
        name: kennelName,
        location: kennelLocation,
        services: JSON.stringify(kennelServices),
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
              placeholder="Enter your kennel's location"
              type="string"
              onChange={(event) => setKennelLocation(event?.target.value)}
            />{" "}
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="phone">Services</FormLabel>

          <Select
            required
            isMulti
            options={services}
            onChange={onSelectServices}
          />
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
          isDisabled={currentStep >= 3 || !kennelServices.length}
          variant="primary"
        >
          Next
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
