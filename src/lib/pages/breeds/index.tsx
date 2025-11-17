import {
  Stack,
  Heading,
  Text,
  Box,
  Container,
  SimpleGrid,
  Alert,
  AlertIcon,
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import Head from "next/head";
import { GetStaticProps } from 'next';

import { useAllAvailableUserBreeds } from "lib/hooks/queries/useUserBreeds";
import { Loader } from "lib/components/ui/Loader";
import { NextSeo } from 'next-seo';
import { BreedList } from "lib/pages/dashboard/breeds/BreedList";
import { supabase } from "lib/supabase/client";
import { SearchIcon } from "@chakra-ui/icons";
import { useMemo, useState } from "react";
import { SortbySelect } from "../../components/ui/SortBySelect";
import { useRouter } from "next/router";
import { BreedCard } from "lib/components/ui/BreedCard";

interface BreedsPageProps {
  initialBreeds?: any[];
}

export default function Breeds({ initialBreeds }: BreedsPageProps) {
  const { data: availableBreeds, isLoading, error } = useAllAvailableUserBreeds();
  // Use server-side data if available, otherwise client-side data
  const breeds = availableBreeds || initialBreeds || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const router = useRouter();

  // Filter breeds based on search and group
  const filteredBreeds = useMemo(() => {
    return breeds.filter((userBreed) => {
      const breed = userBreed.breeds;
      if (!breed) return false;

      const matchesSearch = breed.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        breed.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = !selectedGroup || breed.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [breeds, searchTerm, selectedGroup]);

  // Get unique breed groups for filter
  const breedGroups = useMemo(() => {
    const groups = new Set();
    breeds.forEach((userBreed) => {
      if (userBreed.breeds?.group) {
        groups.add(userBreed.breeds.group);
      }
    });
    return Array.from(groups) as string[];
  }, [breeds]);

  if (isLoading && !initialBreeds) {
    return <Loader />;
  }

  if (error && !initialBreeds) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading breeds data. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <>

      <Head >
        <title>Dog Breeds Available | DogHouse Kenya</title>
        <meta name="description" content="Browse dog breeds from verified breeders in Kenya. Connect with professional breeders and find your perfect companion." />
        <meta name="keywords" content="dog breeds Kenya, puppies for sale, dog breeders Kenya, Golden Retriever, Boerboel, Great Dane, verified breeders" />
        <meta name="robots" content="index, follow" />
      </Head>

      <NextSeo
        title="Dog Breeds Available | DogHouse Kenya"
        description="Explore dog breeds available from verified breeders in Kenya. Find Golden Retrievers, Boerboels, Great Danes, and more from reputable breeders across the country."
        openGraph={{
          title: "Dog Breeds Available | DogHouse Kenya",
          description: "Browse dog breeds from verified breeders in Kenya. Connect with professional breeders and find your perfect companion.",
          images: [
            {
              url: "/images/logo.png",
              width: 1200,
              height: 630,
              alt: "DogHouse Kenya - Dog Breeds",
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "dog breeds Kenya, puppies for sale, dog breeders Kenya, Golden Retriever, Boerboel, Great Dane, verified breeders"
          },
          {
            name: "robots",
            content: "index, follow"
          }
        ]}
      />

      <Container
        pt={{
          base: "4",
          lg: "8",
        }}
        pb={{
          base: "12",
          lg: "24",
        }}
      >
        <Stack spacing="5">
          <Stack spacing="1">
            <Heading size="md" mb={{ base: "3", md: "0" }}>
              Available Dog Breeds
            </Heading>

            <Text color="muted">
              Explore our comprehensive list of dog breeds from verified breeders across Kenya.
            </Text>
          </Stack>


          <Stack spacing="4" direction={{ base: "column", md: "row" }}>

            <Select
              placeholder="All Groups"
              value={selectedGroup}
              onChange={(e) => { setSelectedGroup(e.target.value) }}
              maxW="200px"
            >
              {breedGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>

            <InputGroup flex="1" minW="50vw">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search breeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Stack>

          <HStack spacing={4} justify="space-between">
            {/* Results count */}
            <Text color="gray.600" fontSize="sm">
              Showing {filteredBreeds.length} of {breeds.length} breeds
            </Text>
            <SortbySelect
              width="120px"
              defaultValue="23"
              placeholder="Sort"
            />

          </HStack>
          {filteredBreeds.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {filteredBreeds.map((userBreed) => (
                <BreedCard
                  key={userBreed.id}
                  userBreed={userBreed}
                  userRole={'seeker'}
                  onClick={() => router.push(`/breeds/${userBreed.breeds?.name.replace(/\s+/g, '-').toLowerCase()}`)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Center py={12}>
              <Text color="gray.500">
                No breeds found matching your criteria.
              </Text>
            </Center>
          )}
        </Stack>
      </Container>
    </>
  );
}

// SEO Optimization: Pre-render breeds data at build time
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch available breeds data from Supabase for SEO
    const { data, error } = await supabase
      .from('user_breeds')
      .select(`
        id,
        user_id,
        breed_id,
        is_owner,
        notes,
        images,
        created_at,
        updated_at,
        breeds (
          id,
          name,
          description,
          group,
          featured_image_url,
          height,
          weight,
          life_span,
          traits
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in getStaticProps:', error);
      return {
        props: {
          initialBreeds: [],
        },
        revalidate: 3600,
      };
    }

    // Deduplicate by breed_id and return unique breeds (same logic as useAllAvailableUserBreeds)
    const uniqueBreeds = data?.reduce((acc, userBreed) => {
      if (userBreed.breeds && !acc.some(item => item.breed_id === userBreed.breed_id)) {
        acc.push({
          ...userBreed,
          // Include aggregated data from all breeders offering this breed
          breeder_count: data.filter(item => item.breed_id === userBreed.breed_id).length,
          // Use the most recent images from any breeder
          all_images: data
            .filter(item => item.breed_id === userBreed.breed_id && item.images)
            .flatMap(item => item.images || [])
        });
      }
      return acc;
    }, [] as any[]) || [];

    return {
      props: {
        initialBreeds: uniqueBreeds,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialBreeds: [],
      },
      revalidate: 3600,
    };
  }
};
