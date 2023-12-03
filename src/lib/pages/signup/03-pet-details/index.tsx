// import React from 'react';

import {
  Stack,
  FormControl,
  FormLabel,
  Text,
  useToast,
  Button,
  ButtonGroup,
  Spacer,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import { Select } from "chakra-react-select";

import breedData from "../../../data/breeds_with_group.json";
import { RadioButton } from "lib/components/RadioButton";
import { RadioButtonGroup } from "lib/components/RadioButtonGroup";

// eslint-disable-next-line
export const PetDetails = ({ currentStep, setStep }: any) => {
  const [userProfile, setUserProfile] = useState({} as any);
  const [breeds, setBreeds] = useState([] as any[]);
  const [selectedBreed, setSelectedBreed] = useState<any>({} as any);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedSex, setSelectedSex] = useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    setLoading(true);

    setBreeds(
      breedData.map((breed) => ({
        label: breed.name,
        value: breed.name,
      }))
    );

    const profile = JSON.parse(localStorage.getItem("profile"));

    if (profile) {
      setLoading(false);
      setUserProfile(profile);
      setSelectedRole(profile.roles[0]);

      if (profile.pet_profiles) {
        const petProfile = profile.pet_profiles[0];
        setSelectedBreed(petProfile.breed);
        setSelectedAge(petProfile.age);
        setSelectedSex(petProfile.sex);
      }
    }
  }, []);

  // eslint-disable-next-line
  const onSelectBreed = (selectedBreed: any) => {
    const breed = breedData.find((breed) => breed.name === selectedBreed.value);
    if (breed) {
      setSelectedBreed(breed);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const payload = {
        ...userProfile,
        pet_profiles: [
          {
            breed: selectedBreed,
            sex: selectedSex,
            age: selectedAge,
          },
        ],
      };

      localStorage.setItem("profile", JSON.stringify(payload));

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
    <>
      {!loading && (
        <Stack
          as="form"
          spacing={{ base: 6, md: 9 }}
          onSubmit={(event) => onSubmit(event)}
        >
          <Heading size="md">
            Awesome! Tell us about your
            {selectedRole.includes("dog_seeker") ? " ideal " : ""} furry friend
            🐶
          </Heading>

          <Stack spacing={{ base: 3, md: 9 }}>
            <FormControl>
              <FormLabel htmlFor="breeds" fontWeight="semibold">
                Breed
              </FormLabel>
              <Select
                placeholder="Select breed..."
                colorScheme="brand"
                options={breeds}
                value={{ label: selectedBreed.name, value: selectedBreed.name }}
                onChange={onSelectBreed}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="breeds" fontWeight="semibold">
                Age
              </FormLabel>

              <RadioButtonGroup
                key="age"
                size="md"
                value={selectedAge}
                onChange={setSelectedAge}
              >
                <RadioButton value="puppy">
                  <Text
                    fontWeight={selectedAge === "puppy" ? "semibold" : "normal"}
                  >
                    Puppy
                  </Text>
                </RadioButton>
                <RadioButton value="adolescent">
                  <Text
                    fontWeight={
                      selectedAge === "adolescent" ? "semibold" : "normal"
                    }
                  >
                    Adolescent
                  </Text>
                </RadioButton>
                <RadioButton value="adult">
                  <Text
                    fontWeight={selectedAge === "adult" ? "semibold" : "normal"}
                  >
                    Adult
                  </Text>
                </RadioButton>
              </RadioButtonGroup>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="sex" fontWeight="semibold">
                Sex/Gender
              </FormLabel>

              <RadioButtonGroup
                key="sex"
                size="md"
                value={selectedSex}
                onChange={setSelectedSex}
              >
                <RadioButton value="male">
                  <Text
                    fontWeight={selectedSex === "male" ? "semibold" : "normal"}
                  >
                    Male
                  </Text>
                </RadioButton>
                <RadioButton value="female">
                  <Text
                    fontWeight={
                      selectedSex === "female" ? "semibold" : "normal"
                    }
                  >
                    Female
                  </Text>
                </RadioButton>
              </RadioButtonGroup>
            </FormControl>
          </Stack>

          <ButtonGroup width="100%" mb="4">
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
              isDisabled={!selectedBreed || !selectedSex || !selectedAge}
              variant="primary"
            >
              Next
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </>
  );
};
