import { Alert, AlertIcon, Box, Center, Container, Heading, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue, Text, Icon, SimpleGrid, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Table, TableCaption, TableContainer, Th, Thead, Tr, Tbody, Td } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "lib/components/layout/Footer";
import BreedDetails from "lib/pages/breeds/breed-details";
import { useBreedByName } from "lib/hooks/queries";
import { BreedersList } from "lib/pages/dashboard/breeds/browse/BreederList";
import { BreedListings } from "./BreedListings";
import { Loader } from "lib/components/ui/Loader";
import { Gallery } from "lib/components/ui/GalleryWithCarousel/Gallery";
import { Rating } from "lib/pages/breeds/breed-details/BreedInfo";
import { BiPackage, BiCheckShield } from "react-icons/bi";
import { Ri24HoursLine } from "react-icons/ri";

interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
  featured_image_url?: string;
}

const BreedDetailPage = () => {
  const router = useRouter();
  const breedName = router.query.breedName as string;

  const { data: breed, isLoading: isLoadingBreed, error: errorLoadingBreed } = useBreedByName(breedName);



  if (isLoadingBreed) {
    return (
      <Container maxW="7xl" py={8}>
        <Center height="200px">
          <Loader />
        </Center>
      </Container>
    );
  }


  if (errorLoadingBreed) {
    return (
      <Container maxW="7xl">
        <Alert status="error">
          <AlertIcon />
          Error loading breeds data. Please try again later.
        </Alert>
      </Container>
    );
  }
  return (
    <>
      <Head>
        <title>
          {breedName
            ? `${breedName.charAt(0).toUpperCase() +
            breedName.slice(1).replace(/-/g, " ")
            } | Doghouse`
            : ""}
        </title>
      </Head>
      <Box as="section" h="100vh">
        <Container
          pt={{
            base: "4",
            lg: "8",
          }}
        >
          <Stack
            spacing={{ base: "6", lg: "12", xl: "16" }}
          >
            <Stack
              direction={{ base: "column-reverse", lg: "row" }}
              spacing={{ base: "6", lg: "12", xl: "16" }}
            >
              <Stack flex="1" spacing="6">
                <Heading
                  size={{ base: "sm", md: "md" }}
                  textTransform="capitalize"
                >
                  {breed.name}
                </Heading>

                <Text color="muted">{breed.description}</Text>

                <BreedInfo breed={breed} />
              </Stack>
              <Gallery
                rootProps={{ flex: "1", flexGrow: 1, minHeight: "100%", }}
                images={[{ src: breed?.featured_image_url, alt: "" }]}
              />


            </Stack>



            <Tabs variant='soft-rounded' colorScheme='brand'>
              <TabList>
                <Tab>Breeders</Tab>
                <Tab>Listings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <BreedersList breed={breed} />
                </TabPanel>
                <TabPanel>
                  <BreedListings breedId={breed.id} />
                </TabPanel>
              </TabPanels>
            </Tabs>

          </Stack>
        </Container>
      </Box>
    </>
  );
};


const BreedInfo = ({ breed }) => {

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              Breed Info
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <TableContainer >
            <Table variant='striped' colorScheme='brand' maxWidth="sm">
              <Tbody>
                <Tr>
                  <Td>Breed Group</Td>
                  <Td>{breed.group} group</Td>
                </Tr>
                <Tr>
                  <Td>Height</Td>
                  <Td>{breed.height}</Td>
                </Tr>
                <Tr>
                  <Td>Weight</Td>
                  <Td>{breed.weight}</Td>
                </Tr>
                <Tr>
                  <Td>Life Span</Td>
                  <Td>{breed.life_span}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left'>
              Characteristics
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Stack spacing="2" bg={useColorModeValue("gray.50", "gray.700")}>
            {breed.traits &&
              // @ts-ignore
              breed.traits.map((group) => (
                <HStack
                  flex={1}
                  justifyContent="space-between"
                  alignItems="center"
                  key={group.category}
                >
                  <Text fontSize={{ base: "sm", lg: "md" }} color="muted">
                    {group.category}
                  </Text>
                  <HStack gap="$2" alignItems="center">
                    <Rating score={group.score} />
                  </HStack>
                </HStack>
              ))}


          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default BreedDetailPage;
