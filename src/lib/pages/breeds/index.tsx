import {
  Stack,
  Heading,
  Text,
  Box,
  Container,
  SimpleGrid,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Head from "next/head";
import { GetStaticProps } from 'next';

import { useAllAvailableUserBreeds } from "lib/hooks/queries/useUserBreeds";
import { Loader } from "lib/components/ui/Loader";
import { NextSeo } from 'next-seo';
import { supabaseServer } from 'lib/supabase/server';
import { BreedList } from "lib/pages/dashboard/breeds/BreedList";

interface BreedsPageProps {
  initialBreeds?: any[];
}

export default function Breeds({ initialBreeds }: BreedsPageProps) {
  const { data: availableBreeds, isLoading, error } = useAllAvailableUserBreeds();

  // Use server-side data if available, otherwise client-side data
  const breeds = availableBreeds || initialBreeds || [];

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

      <Box as="section">
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
                Each breed is offered by professional breeders committed to ethical breeding practices.
              </Text>
            </Stack>

            <BreedList
              breeds={breeds}
              userRole="seeker"
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

// SEO Optimization: Pre-render breeds data at build time
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch available breeds data from Supabase for SEO
    const { data, error } = await supabaseServer
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
