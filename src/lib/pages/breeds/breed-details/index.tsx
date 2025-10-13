<<<<<<< HEAD
import { Stack, Text, Spinner, Center } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import breeds from "../../../data/breeds_with_group_and_traits.json";
import type { Breed } from "lib/models/breed";

import { BreedInfo } from "./BreedInfo";
import { Gallery } from "./Gallery";
import WhatsIncluded from "./WhatsIncluded";

export default function BreedDetails({
  breedName,
}: // eslint-disable-next-line
  React.PropsWithChildren<{ breedName: string }>) {

  const [selectedBreed, setSelectedBreed] = useState({} as Breed);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([] as { src: string; alt: string }[]);

  const router = useRouter();
=======
import {
  Image,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Skeleton,
  Flex,
  Spinner,
  Center,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { FiHeart } from "react-icons/fi";

// import { Gallery } from "./Gallery";

export default function BreedDetails({
  breedName,
  selectedBreed,
  setSelectedBreed,
  loading,
  setLoading,
  isDrawer,
  isMobile,
}: // eslint-disable-next-line
any) {
  // const [images, setImages] = useState([] as string[]);
>>>>>>> parent of b0357f4 (feat(components): Remove app features)

  useEffect(() => {
    const getBreed = async () => {
      setLoading(true);
<<<<<<< HEAD

      try {
        const breedInfo: Breed = breeds.find(
          (breed) => breed.name === breedName.replace(/-/g, " ")
        );

        if (breedInfo) {
          setSelectedBreed(breedInfo);
          const breedImages = breedInfo.images
            ? breedInfo.images.map((image) => ({
                src: image,
                alt: "",
              }))
            : [breedInfo.image].map((image) => ({
                src: image,
                alt: "",
              }));
          setImages(breedImages);
        }
      } catch (err) {
        router.push("/404");
=======
      setSelectedBreed({});
      try {
        const data = await fetch(
          `/api/get-breed?breedName=${breedName.replace(/-/g, " ")}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const breedInfo = await data.json();
        if (breedInfo) {
          setSelectedBreed({
            name: breedInfo.name,
            description: breedInfo.description,
            image: breedInfo.image,
          });
        }
      } catch (err) {
        //
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
      }

      setLoading(false);
    };
    getBreed();
<<<<<<< HEAD
  }, [
    breedName,
    setLoading,
    setSelectedBreed,
    router,
    selectedBreed.image,
    selectedBreed.images,
  ]);
=======
  }, [breedName, setLoading, setSelectedBreed]);
>>>>>>> parent of b0357f4 (feat(components): Remove app features)

  return (
    <>
      <Head>
<<<<<<< HEAD
        <Text textTransform="capitalize">
          {breedName
            ? `${breedName.replace(/-/g, " ")} | Doghouse `
            : "Doghouse"}{" "}
        </Text>
      </Head>
      {!loading && (
        <Stack spacing="4">
          <Stack
            direction={{ base: "column-reverse", lg: "row" }}
            spacing={{ base: "6", lg: "12", xl: "16" }}
          >
            <BreedInfo breed={selectedBreed} />
            <Gallery
              rootProps={{ overflow: "hidden", flex: "1" }}
              images={images}
            />
          </Stack>

          <WhatsIncluded />
=======
        <title>{breedName.replace(/-/g, " ")} - Doghouse</title>
      </Head>
      {!loading && (
        <Stack
          direction={isDrawer || isMobile ? "column-reverse" : "row"}
          spacing={{ base: "6", lg: "12", xl: "16" }}
        >
          <Stack spacing={{ base: "6", lg: "8" }} justify="center">
            <Stack spacing={{ base: "3", md: "4" }} overflow="scroll">
              <Stack spacing="3">
                <Flex justify="space-between">
                  <Heading size="md" fontWeight="medium" mr="4">
                    {selectedBreed.name}
                  </Heading>

                  <IconButton
                    aria-label="Add to favorites"
                    variant="outline"
                    fontSize="md"
                    icon={<Icon as={FiHeart} boxSize="4" />}
                    isDisabled={loading}
                  >
                    Favorite
                  </IconButton>
                </Flex>
              </Stack>
              <Text // eslint-disable-next-line
                color={useColorModeValue("gray.600", "gray.400")}
                noOfLines={isDrawer && isMobile ? [6, 10] : []}
              >
                {selectedBreed.description}
              </Text>
            </Stack>
          </Stack>

          {/* <Gallery
            rootProps={{ overflow: "hidden", flex: "1" }}
            images={[{ src: selectedBreed.image, alt: selectedBreed.name }]}
          /> */}

          <Flex width="full" paddingY={3}>
            <Image
              height={isDrawer || isMobile ? "300px" : "200px"}
              width="700px"
              objectFit="cover"
              src={selectedBreed.image}
              alt={selectedBreed.name}
              fallback={<Skeleton />}
            />
          </Flex>
>>>>>>> parent of b0357f4 (feat(components): Remove app features)
        </Stack>
      )}

      {loading && (
        <Center height="full" paddingY={6}>
          <Spinner size="lg" />
        </Center>
      )}
    </>
  );
}
