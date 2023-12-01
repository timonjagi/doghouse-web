import {
  useColorModeValue,
  Stack,
  FormControl,
  FormLabel,
  Divider,
  Flex,
  Button,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Dropzone } from "lib/components/Dropzone";
import { RadioButton } from "lib/components/RadioButton";
import { RadioButtonGroup } from "lib/components/RadioButtonGroup";
import React, { useEffect, useState } from "react";
import breedData from "../../../../data/breeds_with_group.json";

import { Select } from "chakra-react-select";

type PetProfileEditProps = {
  pet: any;
};

const PetProfileEdit: React.FC<PetProfileEditProps> = ({ pet }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSex, setSex] = useState<string>("");
  const [selectedAge, setAge] = useState<string>("");
  const [breeds, setBreeds] = useState([] as any[]);
  const [selectedBreed, setBreed] = useState<any>({} as any);
  const [vaccinations, setVaccinations] = useState([] as any);

  const [loading, setLoading] = useState(true);

  const toast = useToast();
  const availableVaccinations = [
    "Parvovirus",
    "Distemper",
    "Leptovirus",
    "Hepatitis",
    "Rabies",
  ];
  useEffect(() => {
    setBreeds(
      breedData.map((breed) => ({
        label: breed.name,
        value: breed.name,
      }))
    );

    const breed = breedData.find((breed) => breed.name === pet.breed);
    setBreed(breed);
    setAge(pet.age);
    setSex(pet.sex);
  }, []);

  const onSelectBreed = (selectedBreed: any) => {
    const breed = breedData.find((breed) => breed.name === selectedBreed.value);
    if (breed) {
      setBreed({ label: breed.name, value: breed.name });
    }
  };

  const onSelectVaccination = (selectedVaccinations) => {
    setVaccinations(selectedVaccinations);
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const reader = new FileReader();

    if (files?.length) {
      reader.readAsDataURL(files[0]);

      reader.onload = (readerEvent) => {
        const newFile = readerEvent.target?.result;
        if (newFile) {
          if (selectedFiles.includes(newFile)) {
            return toast({
              title: "Image already selected",
              description: "Please select a different image",
              status: "error",
              duration: 4000,
            });
          }
          setSelectedFiles([...selectedFiles, newFile]);
        }
      };
    }
  };

  const onRemoveImage = (file) => {
    const files = selectedFiles.filter((selectedFile) => selectedFile !== file);
    setSelectedFiles(files);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
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
    <Box bg="bg-surface" borderRadius="lg" flex="1">
      <Stack
        spacing="5"
        px={{ base: "4", md: "6" }}
        py={{ base: "5", md: "6" }}
      >
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

          <FormControl>
            <FormLabel htmlFor="vaccinations" fontWeight="semibold">
              Vaccinations
            </FormLabel>
            <Select
              placeholder="Select vaccinations..."
              colorScheme="brand"
              isMulti
              options={availableVaccinations}
              value={vaccinations}
              onChange={onSelectVaccination}
            />
          </FormControl>
        </Stack>

        {/* <FormControl id="picture">
          <FormLabel>Picture</FormLabel>
          <Dropzone
            selectedFiles={selectedFiles}
            onRemove={onRemoveImage}
            onChange={onSelectImage}
            maxUploads={1}
          />
        </FormControl> */}
      </Stack>
      <Divider />

      <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
        <Button
          type="submit"
          variant="primary"
          onClick={onSubmit}
          isLoading={loading}
        >
          Save
        </Button>
      </Flex>
    </Box>
  );
};
export default PetProfileEdit;
