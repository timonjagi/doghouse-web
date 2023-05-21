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
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";

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

  useEffect(() => {
    const getBreed = async () => {
      setLoading(true);
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
      }

      setLoading(false);
    };
    getBreed();
  }, [breedName, setLoading, setSelectedBreed]);

  return (
    <>
      <Head>
        <title>{breedName.replace(/-/g, " ")} - Doghouse</title>
      </Head>
      {selectedBreed.name && (
        <Stack
          direction={isDrawer || isMobile ? "column-reverse" : "row"}
          spacing={{ base: "6", lg: "12", xl: "16" }}
        >
          <Stack spacing={{ base: "6", lg: "8" }} justify="center">
            <Stack spacing={{ base: "3", md: "4" }}>
              <Stack spacing="3">
                <Heading size="md" fontWeight="medium">
                  {selectedBreed.name}
                </Heading>
              </Stack>
              <Text // eslint-disable-next-line
                color={useColorModeValue("gray.600", "gray.400")}
                noOfLines={[6, 10]}
              >
                {selectedBreed.description}
              </Text>
            </Stack>
          </Stack>

          {/* <Gallery
            rootProps={{ overflow: "hidden", flex: "1" }}
            images={[{ src: selectedBreed.image, alt: selectedBreed.name }]}
          /> */}

          <Flex width="full">
            <Image
              height={isDrawer || isMobile ? "300px" : "200px"}
              width="700px"
              objectFit="cover"
              src={selectedBreed.image}
              alt={selectedBreed.name}
              fallback={<Skeleton />}
            />
          </Flex>
        </Stack>
      )}

      {loading && (
        <Center height="full">
          <Spinner size="lg" />
        </Center>
      )}
    </>
  );
}
