import {
  Card,
  Stack,
  Icon,
  Flex,
  Heading,
  HStack,
  Wrap,
  Tag,
  Text,
  Box,
  Square,
  Image,
  Button,
  useDisclosure,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useSteps,
  ModalFooter,
  useToast,
  Divider,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowLeft, FaRegCalendarTimes, FaTransgender } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import PetProfileEdit from "./PetProfileEdit";
import { IoMdClose } from "react-icons/io";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { fireStore, storage } from "lib/firebase/client";
import { useRouter } from "next/router";
import breedData from "../../../../data/breeds_with_group.json";

type PetDetailProps = {
  pet: any;
};

export const PetDetail: React.FC<PetDetailProps> = ({ pet }) => {
  console.log(pet.breedGroup);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const onDeleteImage = (image) => {};

  const steps = [
    { title: "Select Breed" },
    { title: "Choose age" },
    { title: "Choose sex/gender" },
    { title: "Select vaccinations" },
    { title: "Upload photos" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [loading, setLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSex, setSex] = useState<string>("");
  const [selectedAge, setAge] = useState<string>("");
  const [selectedBreed, setBreed] = useState<any>({} as any);
  const [selectedVaccinations, setVaccinations] = useState([] as any);
  const router = useRouter();
  const toast = useToast();

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

    const petId = router.query.petId;

    setLoading(true);

    try {
      const petDocRef = doc(fireStore, "pets", petId as string);

      let downloadUrls = [];
      let newPetDocRef;
      // update pet doc by adding image urls
      if (pet) {
        await updateDoc(petDocRef, {
          breed: selectedBreed.name,
          age: selectedAge,
          sex: selectedSex,
          vaccinations: selectedVaccinations.map(
            (vaccination) => vaccination.value
          ),
        });
      } else {
        newPetDocRef = await addDoc(collection(fireStore, "pets"), {
          breed: selectedBreed.name,
          age: selectedAge,
          sex: selectedSex,
          vaccinations: selectedVaccinations.map(
            (vaccination) => vaccination.value
          ),
        });
      }

      selectedFiles.length
        ? selectedFiles.forEach(async (file, index) => {
            // store images in firebase/storage
            const imageRef = ref(
              storage,
              `pets/${newPetDocRef ? newPetDocRef.id : petDocRef.id}/image${
                index + 1
              }`
            );
            await uploadString(imageRef, file, "data_url");

            // get download url from stroage
            const downloadUrl = await getDownloadURL(imageRef);
            downloadUrls.push(downloadUrl);
          })
        : null;

      // update doc with image urls
      await updateDoc(newPetDocRef ? newPetDocRef : petDocRef, {
        images: downloadUrls ? downloadUrls : pet.imageUrls,
      });

      setLoading(false);
      onClose();
      router.push("/account/pets/" + petId);

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

  return (
    <Box as="section">
      <HStack as={Link} href="/account/pets" py="4">
        <Icon as={FaArrowLeft} color="subtle" fontSize="12px" />
        <Text fontWeight="medium" fontSize="sm" color="subtle">
          Back to Pets
        </Text>
      </HStack>

      <Card p="8">
        <Stack spacing={{ base: "4", md: "8" }}>
          <Stack width="full">
            <Flex justifyContent="space-between" alignItems="center">
              <Avatar size="2xl" src={`/images/${pet.breedGroup}`}></Avatar>

              <Stack spacing="2">
                <Heading
                  size="md"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                  marginEnd="6"
                  textTransform="capitalize"
                >
                  {pet.breed}
                </Heading>
                <HStack spacing="3">
                  <Icon fontSize="xl" as={FaTransgender} color="subtle" />
                  <Text textTransform="capitalize" fontSize="sm">
                    {pet.sex}
                  </Text>
                </HStack>

                <HStack spacing="3">
                  <Icon fontSize="xl" as={FaRegCalendarTimes} color="subtle" />
                  <Text textTransform="capitalize" fontSize="sm">
                    {pet.age}
                  </Text>
                </HStack>
              </Stack>
            </Flex>

            {/* <Text mt="1" fontWeight="medium" textTransform="capitalize">
              {pet.breedGroup} Group
            </Text> */}

            <Text fontWeight="semibold" mt="8" mb="2">
              Vaccinations
            </Text>
            {pet.vaccinations ? (
              <Wrap shouldWrapChildren>
                {pet.vaccinations.map((vaccination) => {
                  <Tag>{vaccination}</Tag>;
                })}
              </Wrap>
            ) : (
              <Text color="muted" fontSize="sm">
                No vaccinations added
              </Text>
            )}

            <Text fontWeight="semibold" mt="8" mb="2">
              Photos
            </Text>

            {pet.images && pet.images.length ? (
              <>
                {pet.images.map((image) => {
                  <Box p="2">
                    <Square size={{ base: "24", lg: "32" }}>
                      <Image
                        width="100%"
                        height="100%"
                        borderRadius="lg"
                        objectFit="cover"
                        src={image}
                        alt={image}
                        bg="bg-subtle"
                      />
                      <IconButton
                        position="absolute"
                        aria-label="remove-image"
                        icon={<IoMdClose />}
                        variant="outline"
                        height="28px"
                        onClick={() => onDeleteImage(image)}
                      ></IconButton>
                    </Square>
                  </Box>;
                })}
              </>
            ) : (
              <Text color="muted" fontSize="sm">
                No photos uploaded
              </Text>
            )}
          </Stack>
        </Stack>
      </Card>

      <Modal onClose={onClose} isOpen={isOpen} size={{ base: "xs", md: "lg" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {/* <PetProfileEdit
              activeStep={activeStep}
              onClose={onClose}
              setBreed={setBreed}
              setSex={setSex}
              setAge={setAge}
              setImmunizations={setVaccinations}
              setSelectedFiles={setSelectedFiles}
              selectedBreed={selectedBreed}
              selectedSex={selectedSex}
              selectedAge={selectedAge}
              selectedFiles={selectedFiles}
              selectedImmunizations={selectedImmunizations}
              onSelectBreed={onSelectBreed}
              onSelectVaccination={onSelectVaccination}
              onSelectImage={onSelectImage}
              onRemoveImage={onRemoveImage}
            /> */}
          </ModalBody>

          <Divider />
          <ModalFooter>
            <Flex py="4" justify="space-between" flex="1">
              <Button
                leftIcon={<FiChevronLeft />}
                type="submit"
                variant="ghost"
                onClick={() => setActiveStep(activeStep - 1)}
                isLoading={loading}
                isDisabled={activeStep === 0}
              >
                Back
              </Button>

              <Spacer />

              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                onClick={
                  activeStep < steps.length
                    ? () => setActiveStep(activeStep + 1)
                    : () => onSubmit
                }
              >
                {activeStep < steps.length ? "Next" : "Save"}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
