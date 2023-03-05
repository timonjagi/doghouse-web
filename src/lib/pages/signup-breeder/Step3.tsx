// import React from 'react';

import {
  Stack,
  FormControl,
  FormLabel,
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
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
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { MenuListProps } from "react-select";
import AsyncSelect from "react-select/async";

import { fireStore } from "lib/firebase/client";

interface Breed {
  id: string;
  name: string;
  description: string;
  weight: string;
  height: string;
  lifeSpan: string;
}

const NoOptionsMessage = () => {
  return (
    <Flex p={2} justify="center">
      <Text color="gray.500">No breeds found</Text>
    </Flex>
  );
};

const MenuList = ({ children }: MenuListProps) => {
  return (
    <Box>
      <Text casing="capitalize">{children}</Text>
    </Box>
  );
};

// eslint-disable-next-line
export const Step3 = ({ currentStep, setStep }: any) => {
  const toast = useToast();

  const [breeds, setBreeds] = useState([] as Breed[]);
  const [selectedBreeds, setSelectedBreeds] = useState([] as Breed[]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filterBreeds = (inputValue: string) => {
    // eslint-disable-next-line
    const matchingBreeds: any[] = [];

    breeds.forEach((breed) => {
      if (breed.name.toLowerCase().includes(inputValue.toLowerCase())) {
        matchingBreeds.push({ value: breed.id, label: breed.name });
      }
    });
    return matchingBreeds;
  };

  const loadOptions = (inputValue: string) =>
    new Promise<Breed[]>((resolve) => {
      resolve(filterBreeds(inputValue));
    });

  // eslint-disable-next-line
  const onSelectBreed = (selectedBreed: any) => {
    const breedObj = breeds.find((breed) => breed.name === selectedBreed.label);
    setSelectedBreeds((prev) => [...prev, breedObj as Breed]);
  };

  const unSelectBreed = (breed: Breed) => {
    setSelectedBreeds((prev) =>
      prev.filter((selectedBreed) => selectedBreed.id !== breed.id)
    );
  };

  const onSubmit = () => {
    setSubmitting(true);
  };

  useEffect(() => {
    const loadBreeds = async () => {
      setLoading(true);
      try {
        const data = await getDocs(collection(fireStore, "breeds"));
        const breedData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBreeds(breedData as Breed[]);
        // eslint-disable-next-line
      } catch (err: any) {
        toast({
          title: err.message,
          description:
            "Check your network connection or try refreshing the page",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setLoading(false);
    };

    loadBreeds();
  }, [toast]);

  return (
    <Stack spacing={3} as="form" onSubmit={onSubmit}>
      <FormControl>
        <FormLabel htmlFor="phone">Your breeds</FormLabel>
        <AsyncSelect
          instanceId="333"
          placeholder="Search breeds..."
          isDisabled={loading}
          isLoading={loading}
          loadOptions={loadOptions}
          onChange={onSelectBreed}
          components={{ NoOptionsMessage, MenuList }}
        />
      </FormControl>

      {selectedBreeds.length ? (
        <Wrap justify="start">
          {selectedBreeds.map((breed, i) => (
            <Tag
              size="lg"
              // eslint-disable-next-line
              key={i}
              borderRadius="full"
              variant="solid"
              colorScheme="brand"
            >
              <TagLabel>
                <Text casing="capitalize">{breed.name}</Text>
              </TagLabel>
              <TagCloseButton onClick={() => unSelectBreed(breed)} />
            </Tag>
          ))}
        </Wrap>
      ) : (
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
          isLoading={submitting}
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
