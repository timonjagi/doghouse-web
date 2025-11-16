import { Alert, AlertIcon, Box, Container, Heading, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue, Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Table, TableContainer, Tr, Tbody, Td, Button, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useBreedByName } from "lib/hooks/queries";
import { BreedersList } from "lib/pages/dashboard/breeds/BreederList";
import { BreedListings } from "lib/pages/dashboard/breeds/BreedListings";
import { Loader } from "lib/components/ui/Loader";
import { Gallery } from "lib/components/ui/GalleryWithCarousel/Gallery";
import { Rating } from "./BreedInfo";
import { useListingsForBreed } from "lib/hooks/queries/useListings";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { NextSeo } from 'next-seo';
import WhatsIncluded from "./WhatsIncluded";

const BreedDetailPage = () => {
  const router = useRouter();
  const breedName = router.query.breedName as string;

  const { data: breed, isLoading: isLoadingBreed, error: errorLoadingBreed } = useBreedByName(breedName?.replace(/-/g, " "));

  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForBreed(breed?.id);

  if (isLoadingBreed) {
    return (
      <Loader />
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
      <NextSeo
        title={`${breed?.name || breedName} - Dog Breed Information | DogHouse Kenya`}
        description={`Learn everything about the ${breed?.name || breedName} dog breed?. Find breeders, view puppies for sale, and get detailed breed characteristics.`}
        openGraph={{
          title: `${breed?.name || breedName} - Dog Breed Information`,
          description: breed?.description || `Detailed information about the ${breed?.name || breedName} dog breed in Kenya.`,
          images: breed?.featured_image_url ? [{ url: breed?.featured_image_url }] : [],
        }}
      />

      <Head >
        <title>
          {breed?.name}
        </title>
        <meta name="description" content={`Detailed information about the ${breed?.name || breedName} dog breed in Kenya.`} />
        <meta name="keywords" content="dog breeds Kenya, puppies for sale, dog breeders Kenya, Golden Retriever, Boerboel, Great Dane, verified breeders" />
        <meta name="robots" content="index, follow" />
      </Head>

      <Container maxW="7xl" py={{ base: '4', md: '8' }}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => router.push('/breeds')}
          mb={4}
          p={0}
        >
          Back to Breeds
        </Button>
        <Stack
          spacing="8"
        >
          <Heading
            size={{ base: "sm", md: "md" }}
            textTransform="capitalize"
          >
            {breed?.name}
          </Heading>

          <Stack flex="1" spacing="6" direction={{ base: "column", md: "row-reverse" }}>
            <Gallery
              rootProps={{ flex: "1", flexGrow: 1, minHeight: "100%", }}
              images={[{ src: breed?.featured_image_url, alt: breed?.name }]}

            />

            <Tabs variant='soft-rounded' colorScheme='brand' w={{ base: "full", md: "50vw" }}>
              <TabList>
                <Tab>Details</Tab>
                <Tab>Traits</Tab>
                <Tab>Listings</Tab>
                <Tab>Breeders</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack>
                    <Text color="muted">{breed?.description}</Text>

                    <TableContainer >
                      <Table variant='striped' colorScheme='brand' maxWidth="sm">
                        <Tbody>
                          <Tr>
                            <Td>Breed Group</Td>
                            <Td>{breed?.group} group</Td>
                          </Tr>
                          <Tr>
                            <Td>Height</Td>
                            <Td>{breed?.height}</Td>
                          </Tr>
                          <Tr>
                            <Td>Weight</Td>
                            <Td>{breed?.weight}</Td>
                          </Tr>
                          <Tr>
                            <Td>Life Span</Td>
                            <Td>{breed?.life_span}</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack spacing="2" bg={useColorModeValue("gray.50", "gray.700")}>
                    <Accordion allowToggle defaultIndex={0}>
                      {breed?.traits &&
                        // @ts-ignore
                        breed?.traits.map((group) => (
                          <AccordionItem key={group.category}>
                            <h2>
                              <AccordionButton>
                                <Box as='span' flex='1' textAlign='left'>
                                  {group.category}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>

                            <AccordionPanel pb={4}>
                              {group.subTraits?.map((trait) => (
                                <HStack
                                  flex={1}
                                  justifyContent="space-between"
                                  alignItems="center"
                                  key={trait.name}
                                >
                                  <Text fontSize={{ base: "sm", lg: "md" }} color="muted">
                                    {trait.name}
                                  </Text>
                                  <HStack gap="$2" alignItems="center">
                                    <Rating score={trait.score} />
                                  </HStack>
                                </HStack>
                              ))}
                            </AccordionPanel>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <BreedListings
                    listings={listingsForBreed}
                    loading={isLoadingListings}
                    error={error}
                    isManaging={false}
                  />
                </TabPanel>

                <TabPanel>
                  <BreedersList breed={breed} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>


          <WhatsIncluded />
        </Stack>
      </Container>
    </>
  );
};

export default BreedDetailPage;
