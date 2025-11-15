import React, { useState, useMemo } from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Center,
  Alert,
  AlertIcon,
  Box,
  Stack,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  HStack,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { MdLocationOn, MdStar, MdFilterList } from "react-icons/md";
import { Loader } from "lib/components/ui/Loader";
import { useAllAvailableUserBreeds } from "lib/hooks/queries/useUserBreeds";
import { useBreederProfile } from "lib/hooks/queries/useBreederProfile";
import { NextSeo } from 'next-seo';
import Link from "next/link";

// Hook to get all breeders
const useAllBreeders = () => {
  const { data: breedsData, isLoading: breedsLoading, error: breedsError } = useAllAvailableUserBreeds();

  // Extract unique breeders from the breeds data
  const breeders = useMemo(() => {
    if (!breedsData) return [];

    const breederMap = new Map();

    breedsData.forEach((userBreed) => {
      const breederId = userBreed.user_id;
      if (!breederMap.has(breederId)) {
        breederMap.set(breederId, {
          id: breederId,
          userBreed: userBreed,
          breeds: [userBreed],
        });
      } else {
        breederMap.get(breederId).breeds.push(userBreed);
      }
    });

    return Array.from(breederMap.values());
  }, [breedsData]);

  return {
    data: breeders,
    isLoading: breedsLoading,
    error: breedsError,
  };
};

interface BreederCardProps {
  breeder: any;
}

const BreederCard: React.FC<BreederCardProps> = ({ breeder }) => {
  const user = breeder.userBreed.users?.[0];
  const breederProfile = user?.breeder_profiles?.[0];

  if (!user) return null;

  return (
    <Card variant="outline" _hover={{ shadow: "md", transform: "translateY(-2px)" }} transition="all 0.2s">
      <CardBody>
        <Stack spacing={4}>
          <HStack spacing={4}>
            <Avatar
              src={user.profile_photo_url}
              name={breederProfile?.kennel_name || user.display_name}
              size="lg"
            />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="semibold" fontSize="lg">
                {breederProfile?.kennel_name || user.display_name}
              </Text>
              {breederProfile?.kennel_name && (
                <Text color="gray.600" fontSize="sm">
                  {user.display_name}
                </Text>
              )}
              {breederProfile?.kennel_location && (
                <HStack>
                  <MdLocationOn size={16} />
                  <Text fontSize="sm" color="gray.600">
                    {breederProfile.kennel_location}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          <HStack spacing={2} flexWrap="wrap">
            {breederProfile?.rating && (
              <HStack>
                <MdStar color="gold" />
                <Text fontSize="sm">{breederProfile.rating.toFixed(1)}</Text>
              </HStack>
            )}
            {breederProfile?.verified_at && (
              <Badge colorScheme="green" size="sm">Verified</Badge>
            )}
            <Badge colorScheme="blue" size="sm">
              {breeder.breeds.length} breed{breeder.breeds.length !== 1 ? 's' : ''}
            </Badge>
          </HStack>

          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            Specializing in: {breeder.breeds.map(b => b.breeds?.name).filter(Boolean).join(', ')}
          </Text>

          <Link href={`/breeder/${breeder.id}`} passHref>
            <Button colorScheme="brand" size="sm" w="full" as="a">
              View Profile
            </Button>
          </Link>
        </Stack>
      </CardBody>
    </Card>
  );
};

export const PublicBreedersPage: React.FC = () => {
  const { data: breeders, isLoading, error } = useAllBreeders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");

  // Get unique locations and breeds for filters
  const locations = useMemo(() => {
    const locs = new Set();
    breeders?.forEach((breeder) => {
      const location = breeder.userBreed.users?.[0]?.breeder_profiles?.[0]?.kennel_location;
      if (location) locs.add(location);
    });
    return Array.from(locs) as string[];
  }, [breeders]);

  const availableBreeds = useMemo(() => {
    const breeds = new Set();
    breeders?.forEach((breeder) => {
      breeder.breeds.forEach((userBreed) => {
        if (userBreed.breeds?.name) breeds.add(userBreed.breeds.name);
      });
    });
    return Array.from(breeds) as string[];
  }, [breeders]);

  // Filter breeders
  const filteredBreeders = useMemo(() => {
    return breeders?.filter((breeder) => {
      const user = breeder.userBreed.users?.[0];
      const breederProfile = user?.breeder_profiles?.[0];

      const matchesSearch =
        !searchTerm ||
        (breederProfile?.kennel_name || user?.display_name || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        breederProfile?.kennel_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breeder.breeds.some(b =>
          b.breeds?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesLocation = !selectedLocation || breederProfile?.kennel_location === selectedLocation;

      const matchesBreed = !selectedBreed || breeder.breeds.some(b => b.breeds?.name === selectedBreed);

      return matchesSearch && matchesLocation && matchesBreed;
    }) || [];
  }, [breeders, searchTerm, selectedLocation, selectedBreed]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading breeders data. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <NextSeo
        title="Dog Breeders in Kenya | DogHouse Kenya"
        description="Find verified dog breeders in Kenya. Connect with professional breeders offering various dog breeds including Golden Retrievers, Boerboels, and more."
        openGraph={{
          title: "Dog Breeders in Kenya | DogHouse Kenya",
          description: "Browse verified dog breeders across Kenya. Find breeders for your preferred dog breeds and connect directly.",
          images: [
            {
              url: "/images/logo.png",
              width: 1200,
              height: 630,
              alt: "DogHouse Kenya - Dog Breeders",
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "dog breeders Kenya, verified breeders, puppy breeders, dog farms Kenya, professional breeders"
          },
          {
            name: "robots",
            content: "index, follow"
          }
        ]}
      />

      <Container maxW="7xl" py={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <Stack>
            <Heading size={{ base: "sm", lg: "md" }}>
              Dog Breeders in Kenya
            </Heading>
            <Text color="gray.600">
              Connect with verified professional breeders across Kenya. Find breeders for your preferred dog breeds.
            </Text>
          </Stack>

          {/* Filters */}
          <Stack spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search breeders, locations, or breeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <HStack spacing={4}>
              <Select
                placeholder="All Locations"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                maxW="200px"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="All Breeds"
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                maxW="200px"
              >
                {availableBreeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </Select>

              {(selectedLocation || selectedBreed) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLocation("");
                    setSelectedBreed("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </HStack>

            <Text color="gray.600" fontSize="sm">
              Showing {filteredBreeders.length} of {breeders?.length || 0} breeders
            </Text>
          </Stack>

          {/* Breeders Grid */}
          {filteredBreeders.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredBreeders.map((breeder) => (
                <BreederCard key={breeder.id} breeder={breeder} />
              ))}
            </SimpleGrid>
          ) : (
            <Center py={12}>
              <Text color="gray.500">
                No breeders found matching your criteria.
              </Text>
            </Center>
          )}
        </VStack>
      </Container>
    </>
  );
};
