import React from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Center,
  Text,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/router";
import { useWishlist } from "lib/hooks/queries/useWishlist";
import { PageHeaderWithTwoButtons } from "lib/components/ui/PageHeaderWithTwoButtons";
import { Loader } from "lib/components/ui/Loader";
import { BreedCard } from "lib/components/ui/BreedCard2";

const WishlistPage = () => {
  const router = useRouter();
  const { data: wishlistItems, isLoading, error } = useWishlist();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading wishlist. Please try again later.
        </Alert>
      </Container>
    );
  }

  const hasItems = wishlistItems && wishlistItems.length > 0;

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <PageHeaderWithTwoButtons
          title="My Wishlist"
          description="Items you've saved for later and breeds you're interested in"
        />

        {!hasItems ? (
          <Center py={12}>
            <VStack spacing={6}>
              <FiHeart size={64} color="gray" />
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                  Your wishlist is empty
                </Text>
                <Text color="gray.500" textAlign="center">
                  Start browsing and save items you're interested in!
                </Text>
              </VStack>
              <HStack spacing={4}>
                <Button
                  colorScheme="brand"
                  onClick={() => router.push("/dashboard/listings")}
                >
                  Browse Listings
                </Button>
                <Button
                  colorScheme="brand"
                  variant="outline"
                  onClick={() => router.push("/dashboard/breeds")}
                >
                  Explore Breeds
                </Button>
              </HStack>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {wishlistItems.map((item) => {
              const userBreed = item.user_breeds;
              const breed = item.breeds;

              if (!breed) return null;

              return (
                <BreedCard
                  key={item.id}
                  userBreed={userBreed || { breeds: breed }}
                  showWishlistButton={true}
                  userBreedId={userBreed?.id}
                  breedId={item.breed_id}
                />
              );
            })}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default WishlistPage;
