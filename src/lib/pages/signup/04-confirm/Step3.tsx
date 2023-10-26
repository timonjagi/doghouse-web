// import React from 'react';

import {
  Stack,
  FormControl,
  FormLabel,
  Box,
  Flex,
  Text,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import type { MenuListProps } from "react-select";
import Select from "react-select";
import AsyncSelect from "react-select/async";

import breedData from "../../../data/breeds.json";
import { auth, fireStore } from "lib/firebase/client";

interface Breed {
  id: string;
  name: string;
  description: string;
  weight: string;
  height: string;
  lifeSpan: string;
  image: string;
}

const NoOptionsMessage = () => {
  return (
    <Flex p={2} justify="center" bg="on-accent">
      <Text color="gray.500">No breeds found</Text>
    </Flex>
  );
};

const MenuList = ({ children, maxHeight }: MenuListProps) => {
  return (
    <Box maxH={maxHeight} overflowY="scroll">
      <Text casing="capitalize">{children}</Text>
    </Box>
  );
};

// eslint-disable-next-line
export const Step3 = ({ currentStep, setStep }: any) => {
  const [user] = useAuthState(auth);
  const toast = useToast();
  const services = [
    { label: "Sale", value: "sale" },
    { label: "Adoption", value: "adoption" },
    { label: "Exchange", value: "exchange" },
    { label: "Stud", value: "stud" },
  ];
  const [breeds, setBreeds] = useState([] as Breed[]);

  // eslint-disable-next-line
  const [selectedBreeds, setSelectedBreeds] = useState([] as any[]);
  const [selectedServices, setSelectedServices] = useState([] as string[]);
  const [loading, setLoading] = useState(false);

  const filterBreeds = (inputValue: string) => {
    // eslint-disable-next-line
    const matchingBreeds: any[] = [];

    breeds.forEach((breed) => {
      if (breed.name.toLowerCase().includes(inputValue.toLowerCase())) {
        matchingBreeds.push({ value: breed.name, label: breed.name });
      }
    });
    return matchingBreeds;
  };

  const loadOptions = (inputValue: string) =>
    new Promise<Breed[]>((resolve) => {
      resolve(filterBreeds(inputValue));
    });
  // eslint-disable-next-line
  const onSelectServices = (selectedService: any) => {
    if (selectedService) {
      setSelectedServices((prev) => [...prev, selectedService.value]);
    }
  };

  // eslint-disable-next-line
  const onSelectBreed = (selectedBreeds: any) => {
    setSelectedBreeds([...selectedBreeds]);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      let kennelId;

      const kennelQuery = query(
        collection(fireStore, "kennels"),
        where("breederId", "==", user?.uid)
      );
      const kennels = await getDocs(kennelQuery);
      kennels.forEach((kennel) => {
        kennelId = kennel.id;
      });

      if (kennelId) {
        const kennelDocRef = doc(fireStore, "kennels", kennelId);
        await updateDoc(kennelDocRef, {
          breeds: JSON.stringify(selectedBreeds.map((breed) => breed.value)),
          services: JSON.stringify(selectedServices),
        });
      }

      toast({
        title: "Profile completed",
        description: "Your details have been saved.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

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

  const checkIfOptionIsSelected = (option: {
    label: string;
    value: string;
  }) => {
    return !!selectedBreeds.find((breed) => breed.value === option.value);
  };

  useEffect(() => {
    setBreeds(breedData as Breed[]);
  }, []);

  return (
    <Stack spacing={3} as="form" onSubmit={onSubmit}>
      <FormControl>
        <FormLabel htmlFor="phone">
          Services ({selectedServices.length})
        </FormLabel>

        <Select
          required
          isMulti
          options={services}
          onChange={onSelectServices}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="phone">Breeds ({selectedBreeds.length})</FormLabel>
        <AsyncSelect
          instanceId="444"
          placeholder="Search breeds..."
          isClearable
          isOptionDisabled={(option) =>
            checkIfOptionIsSelected(option as { label: string; value: string })
          }
          isMulti
          loadOptions={loadOptions}
          onChange={onSelectBreed}
          maxMenuHeight={300}
          components={{ NoOptionsMessage, MenuList }}
        />
      </FormControl>

      {!selectedBreeds.length && (
        <Alert status="info">
          <AlertIcon />
          No breeds selected.
        </Alert>
      )}

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
          isDisabled={currentStep >= 3 || !selectedBreeds.length}
          variant="primary"
        >
          Finish
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
