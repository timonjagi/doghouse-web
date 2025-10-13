import {
  Stack,
  FormControl,
  FormLabel,
  Box,
  Text,
  useToast,
  useSteps,
  Button,
  Flex,
  Spacer,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Dropzone } from "lib/components/ui/Dropzone";
import React, { useEffect, useState } from "react";
import breedData from "../../../data/breeds_with_group.json";

import { Select } from "chakra-react-select";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { fireStore, storage } from "lib/firebase/client";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useDropZone } from "lib/hooks/useDropZone";
import { useRouter } from "next/router";

type BreedProfileEditProps = {};

const BreedProfile: React.FC<BreedProfileEditProps> = () => {
  const router = useRouter();

  const [breeds, setBreeds] = useState([] as any[]);
  const toast = useToast();

  const [selectedSex, setSex] = useState<string>("");
  const [selectedAge, setAge] = useState<string>("");
  const [selectedBreed, setBreed] = useState<any>({} as any);
  const [selectedImages, setSelectedImages] = useState([] as any);

  const [selectedVaccinations, setVaccinations] = useState([] as any);

  const { onSelectImage, onRemoveImage } = useDropZone({
    selectedImages,
    setSelectedImages,
  });

  const steps = [
    { title: "Breed basics" },
    { title: "Breed details" },
    { title: "Vet information" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const availableVaccinations = [
    { label: "Parvovirus", value: "parvovirus" },
    { label: "Distemper", value: "distemper" },
    { label: "Hepatitis", value: "hepatitis" },
    { label: "Leptovirus", value: "leptovirus" },
    { label: "Rabies", value: "rabies" },
  ];

  const [saving, setSaving] = useState(false);

  const onSelectBreed = (selectedBreed: any) => {
    const breed = breedData.find((breed) => breed.name === selectedBreed.value);
    if (breed) {
      setBreed(breed);
    }
  };

  const onSelectVaccination = (selectedVaccinations) => {
    console.log(selectedVaccinations);
    setVaccinations(selectedVaccinations);
  };

  const onSubmit = async (event?: React.FormEvent) => {
    event.preventDefault();

    setSaving(true);

    try {
      // update Breed doc by adding image urls

      const newDocRef = await addDoc(collection(fireStore, "userBreeds"), {
        breed: selectedBreed.name,
        age: selectedAge,
        sex: selectedSex,
        vaccinations: selectedVaccinations.map(
          (vaccination) => vaccination.value
        ),
      });

      let downloadUrls = [];

      selectedImages.length
        ? selectedImages.forEach(async (file, index) => {
          // store images in firebase/storage
          const imageRef = ref(
            storage,
            `userBreeds/${newDocRef.id}/image${index + 1}`
          );
          await uploadString(imageRef, file, "data_url");

          // get download url from stroage
          const downloadUrl = await getDownloadURL(imageRef);
          downloadUrls.push(downloadUrl);
        })
        : null;

      // update doc with image urls
      await updateDoc(newDocRef, {
        images: downloadUrls,
      });

      setSaving(false);

      // eslint-disable-next-line
    } catch (err: any) {
      toast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      setSaving(false);
    }
  };

  const onNext = () => {
    if (activeStep === steps.length - 1) {
      onSubmit();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  useEffect(() => {
    setBreeds(
      breedData.map((breed) => ({
        label: breed.name,
        value: breed.name,
      }))
    );

    const userBreeds = JSON.parse(localStorage.getItem("userBreeds"));
    const breedName = router.query.userBreedId as string;

    const breed = userBreeds.find(
      (breed) => breed.breed === breedName.replace("-", " ")
    );
    console.log("breed", breed);
    if (breed) {
      setBreed(breed);
      setAge(breed.age);
      setSex(breed.sex);
    }

    console.log(selectedBreed);
  }, []);

  return (
    <Stack spacing="4">
      <HStack spacing={{ base: "2", md: "3" }} as={Link} href="/my-breeds">
        <Icon
          as={FaArrowLeft}
          color={useColorModeValue("brand.400", "brand.600")}
          fontSize={{ base: "sm", md: "md" }}
        />
        <Text
          fontWeight="semibold"
          color={useColorModeValue("brand.400", "brand.600")}
        >
          Back to breeds
        </Text>
      </HStack>
      <Box bg="bg-surface" borderRadius="lg" flex="1">
        <Stack
          spacing="5"
          px={{ base: "4", md: "6" }}
          py={{ base: "5", md: "8" }}
        >
          <FormControl>
            <FormLabel htmlFor="breeds" fontWeight="semibold">
              Breed
            </FormLabel>
            <Select
              placeholder="Select breed..."
              colorScheme="brand"
              options={breeds}
              value={{ label: selectedBreed.breed, value: selectedBreed.breed }}
              onChange={onSelectBreed}
            />
          </FormControl>

          <FormControl id="picture">
            <FormLabel>Photos</FormLabel>
            <Dropzone
              selectedFiles={selectedImages}
              onRemove={onRemoveImage}
              onChange={onSelectImage}
              maxUploads={4}
            />
          </FormControl>
          {/* 
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
          </FormControl> */}

          <Flex py="4" justify="space-between" w="full">
            <Spacer />

            <Button type="submit" variant="primary" onClick={onNext}>
              Save
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Stack>
  );
};
export default BreedProfile;
