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

  useEffect(() => {
    const getBreed = async () => {
      setLoading(true);

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
      }

      setLoading(false);
    };
    getBreed();
  }, [
    breedName,
    setLoading,
    setSelectedBreed,
    router,
    selectedBreed.image,
    selectedBreed.images,
  ]);

  return (
    <>
      <Head>
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
