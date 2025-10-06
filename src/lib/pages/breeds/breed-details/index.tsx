import {
  Stack,
  Heading,
  Text,
  Spinner,
  Center,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Gallery } from "./Gallery";
import breeds from "../../../data/breeds_with_group_and_traits.json";
import { Breed } from "lib/models/breed";
import { useRouter } from "next/router";
import { BreedInfo } from "./BreedInfo";
import { Share } from "lib/components/Share";
import WhatsIncluded from "./WhatsIncluded";

export default function BreedDetails({
  breedName,
}: // eslint-disable-next-line
  React.PropsWithChildren<{ breedName: string }>) {

  const [selectedBreed, setSelectedBreed] = useState({} as Breed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [images, setImages] = useState([] as { src: string, alt: string }[]);

  const router = useRouter();

  useEffect(() => {
    const getBreed = async () => {
      setLoading(true);

      try {
        // const data = await fetch(
        //   `/api/get-breed?breedName=${breedName.replace(/-/g, " ")}`,
        //   {
        //     method: "GET",
        //     headers: { "Content-Type": "application/json" },
        //   }
        // );

        const breedInfo: Breed = breeds.find(
          breed => breed.name === breedName.replace(/-/g, " ")
        )

        if (breedInfo) {
          setSelectedBreed(breedInfo);
          const images = selectedBreed.images ? selectedBreed.images.map(
            image => ({
              src: image,
              alt: ''
            })
          ) : [selectedBreed.image].map(
            image => ({
              src: image,
              alt: ''
            })
          );
          setImages(images);
        }


      } catch (err) {
        setError(true);
        router.push("/404");
      }

      setLoading(false);
    };
    getBreed();
  }, [breedName, setLoading, setSelectedBreed]);

  return (
    <>
      <Head >
        <Text textTransform="capitalize">{breedName ? breedName.replace(/-/g, " ") + ' | Doghouse ' : 'Doghouse'} </Text>
      </Head>
      {!loading && (
        <Stack spacing="4"
        >
          <Stack
            direction={{ base: 'column-reverse', lg: 'row' }}
            spacing={{ base: '6', lg: '12', xl: '16' }}
          >
            <BreedInfo breed={selectedBreed} />
            <Gallery rootProps={{ overflow: 'hidden', flex: '1' }} images={images} />
          </Stack>

          <WhatsIncluded />

        </Stack >
      )
      }

      {
        loading && (
          <Center height="full" paddingY={6}>
            <Spinner size="lg" />
          </Center>
        )
      }
    </>
  );
}
