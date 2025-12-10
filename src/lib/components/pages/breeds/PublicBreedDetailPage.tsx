import { Alert, AlertIcon, Box, Container, Heading, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue, Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Table, TableContainer, Tr, Tbody, Td, SimpleGrid, useBreakpointValue, useToast, Badge } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useBreedByName } from "lib/hooks/queries";
import { BreedersList } from "lib/components/ui/BreederList";
import { Loader } from "lib/components/ui/Loader";
import { Gallery } from "lib/components/ui/GalleryWithCarousel/Gallery";
import { Rating } from "../../ui/BreedInfo";
import { useListingsForBreed } from "lib/hooks/queries/useListings";
import { NextSeo } from 'next-seo';
import ListingList from "lib/components/ui/ListingList";
import EthicalQuestionairreCard from "lib/components/ui/EthicalQuestionairreCard";
import { FiHeart, FiInfo, FiShoppingBag } from "react-icons/fi";
import { GalleryWithHorizontalCarousel } from "lib/components/ui/GalleryWithHorizontalCarousel";
import { GiDogHouse } from "react-icons/gi";
import { LuDog } from "react-icons/lu";
import { useBreedersForBreed } from "lib/hooks/queries/useBreeders";
import { PageHeaderWithTwoButtons } from "lib/components/ui/PageHeaderWithTwoButtons";

const PublicBreedDetailPage = () => {
  const router = useRouter();
  const breedName = router.query.breedName as string;

  const { data: breed, isLoading: isLoadingBreed, error: errorLoadingBreed } = useBreedByName(breedName?.replace(/-/g, " "));

  const { data: listingsForBreed, isLoading: isLoadingListings, error } = useListingsForBreed(breed?.id);


  const { data: breeders, isLoading: isLoadingBreeders, error: breedersError } = useBreedersForBreed(breed?.id);

  const handleListingClick = (listing) => {
    router.push(`/listings/${listing.id}`);
  };
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const onAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "You will be notified when new listings are added.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  if (isLoadingBreed || isLoadingListings || isLoadingBreeders) {
    return (
      <Loader />
    );
  }

  if (errorLoadingBreed || error || breedersError) {
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

      <Container maxW="7xl" py={{ base: 6, md: 6 }}>

        <Stack
          spacing="8"
        >

          <Stack>
            {/* <Heading
              size={{ base: "xs", md: "sm" }}
              textTransform="capitalize"
            >
              {breed?.name}
            </Heading>
            <Badge colorScheme="brand" w="fit-content">
              {breed?.group} group
            </Badge> */}

            <PageHeaderWithTwoButtons
              title={breed?.name}
              description={breed?.group + " group"}
              buttonPrimary={
                {
                  label: "Add to wishlist",
                  variant: "secondary",
                  onClick: onAddToWishlist,
                  icon: <FiHeart />
                }
              }
              flexDir={{ base: "row", md: "row" }}
            // buttonSecondary={[
            //   {
            //     label: "Buy now",
            //     variant: "primary",
            //     onClick: () => router.push(`/listings/${listing.id}`),
            //   },
            // ]}
            />

          </Stack>


          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Gallery images={[{ src: breed?.featured_image_url, alt: breed?.name }]} />

            <Tabs variant='soft-rounded' colorScheme='brand'>
              <TabList
                overflowY="hidden"
                whiteSpace="nowrap"
                css={{
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                }}
              >
                <Tab>
                  <HStack>
                    <FiInfo />
                    <Text
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      Details
                    </Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack>
                    <LuDog />
                    <Text
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      Traits
                    </Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack>
                    <FiShoppingBag />
                    <Text
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      Listings
                    </Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack>
                    <GiDogHouse />
                    <Text
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      Breeders
                    </Text>
                  </HStack>
                </Tab>
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
                  <ListingList
                    listings={listingsForBreed}
                    onListingClick={handleListingClick}
                    emptyMessage={`No ${breed?.name} listings found`}
                    emptyDescription="Add to wishlist to get notified when new listings are added."
                    showEmptyAction={true}
                    onEmptyAction={onAddToWishlist}
                    emptyActionLabel="Add to Wishlist"
                    emptyActionIcon={<FiHeart />}
                    showFilters={false}
                    showResultsCount={false}
                    showSearch={false}
                  />
                </TabPanel>

                <TabPanel>
                  <BreedersList
                    breeders={breeders}
                    emptyMessage={`No ${breed?.name} breeders found`}
                    emptyDescription="Add to wishlist to get notified when new breeders are added."
                    emptyActionLabel="Add to Wishlist"
                    emptyActionIcon={<FiHeart />}
                    emptyAction={onAddToWishlist}
                    columns={{ base: 1, md: 2 }}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </SimpleGrid>


        </Stack>
      </Container>

      {isMobile && <EthicalQuestionairreCard />}

    </>
  );
};

export default PublicBreedDetailPage;
