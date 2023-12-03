import {
  Stack,
  FormControl,
  FormLabel,
  Box,
  Text,
  useToast,
  useSteps,
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
} from "@chakra-ui/react";
import { Dropzone } from "lib/components/Dropzone";
import { RadioButton } from "lib/components/RadioButton";
import { RadioButtonGroup } from "lib/components/RadioButtonGroup";
import React, { useEffect, useState } from "react";
import breedData from "../../../../data/breeds_with_group.json";

import { Select } from "chakra-react-select";
import { useRouter } from "next/router";

type PetProfileEditProps = {
  pet?: any;
  onClose: any;
  activeStep: any;
  setBreed: any;
  setSex: any;
  setAge: any;
  setSelectedFiles: any;
  selectedBreed: any;
  selectedSex: any;
  selectedAge: any;
  selectedFiles: any;
  selectedImmunizations: any;
  onSelectBreed: any;
  onSelectVaccination: any;
  onSelectImage: any;
  onRemoveImage: any;
};

const PetProfileEdit = ({
  pet,
  onClose,
  activeStep,
  setBreed,
  setSex,
  setAge,
  setVaccinations,
  setSelectedFiles,
  selectedBreed,
  selectedSex,
  selectedAge,
  selectedFiles,
  selectedVaccinations,
  onSelectBreed,
  onSelectVaccination,
  onSelectImage,
  onRemoveImage,
}) => {
  const [breeds, setBreeds] = useState([] as any[]);
  const toast = useToast();

  const availableVaccinations = [
    { label: "Parvovirus", value: "parvovirus" },
    { label: "Distemper", value: "distemper" },
    { label: "Hepatitis", value: "hepatitis" },
    { label: "Leptovirus", value: "leptovirus" },
    { label: "Rabies", value: "rabies" },
  ];

  useEffect(() => {
    setBreeds(
      breedData.map((breed) => ({
        label: breed.name,
        value: breed.name,
      }))
    );

    if (pet) {
      const breed = breedData.find((breed) => breed.name === pet.breed);
      setBreed(breed);
      setAge(pet.age);
      setSex(pet.sex);
    }
  }, []);

  return (
    <Box bg="bg-surface" borderRadius="lg" flex="1">
      <Stack
        spacing="5"
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "8" }}
      >
        {activeStep === 0 && (
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
        )}

        {activeStep === 1 && (
          <FormControl>
            <FormLabel htmlFor="breeds" fontWeight="semibold">
              Age
            </FormLabel>

            <RadioButtonGroup
              key="age"
              size="md"
              value={selectedAge}
              onChange={setAge}
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
        )}

        {activeStep === 2 && (
          <FormControl>
            <FormLabel htmlFor="sex" fontWeight="semibold">
              Sex/Gender
            </FormLabel>

            <RadioButtonGroup
              key="sex"
              size="md"
              value={selectedSex}
              onChange={setSex}
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
                  fontWeight={selectedSex === "female" ? "semibold" : "normal"}
                >
                  Female
                </Text>
              </RadioButton>
            </RadioButtonGroup>
          </FormControl>
        )}

        {activeStep === 3 && (
          <FormControl>
            <FormLabel htmlFor="vaccinations" fontWeight="semibold">
              Vaccinations
            </FormLabel>
            <Select
              placeholder="Select vaccinations..."
              colorScheme="brand"
              isMulti
              options={availableVaccinations}
              value={selectedVaccinations}
              onChange={onSelectVaccination}
            />
          </FormControl>
        )}

        {activeStep === 4 && (
          <FormControl id="picture">
            <FormLabel>Photos</FormLabel>
            <Dropzone
              selectedFiles={selectedFiles}
              onRemove={onRemoveImage}
              onChange={onSelectImage}
              maxUploads={4}
            />
          </FormControl>
        )}
      </Stack>
    </Box>
  );
};
export default PetProfileEdit;
