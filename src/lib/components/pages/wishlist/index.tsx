import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Image,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useWishlist, useRemoveFromWishlist, useToggleWishlistNotification } from 'lib/hooks/queries/useWishlist';
import { AddToWishlistButton } from 'lib/components/ui/AddToWishlistButton';

const WishlistPage = () => {
  const router = useRouter();
  const toast = useToast();

  const { data: wishlistItems, isLoading, error } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const toggleNotification = useToggleWishlistNotification();

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      await removeFromWishlist.mutateAsync(id);
      toast({
        title: 'Removed from wishlist',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error removing item',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleToggleNotification = async (id: string, currentValue: boolean) => {
    try {
      await toggleNotification.mutateAsync({ id, notify_when_available: !currentValue });
      toast({
        title: `Notifications ${!currentValue ? 'enabled' : 'disabled'}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating notification setting',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text>Loading your wishlist...</Text>
        </VStack>
      </Container>
    );
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

  const savedUserBreeds = wishlistItems?.filter(item => item.user_breeds) || [];
  const savedBreeds = wishlistItems?.filter(item => item.breed_id && !item.user_breeds) || [];

  const hasItems = savedUserBreeds.length > 0 || savedBreeds.length > 0;

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            My Wishlist
          </Heading>
          <Text color="gray.600">
            Items you've saved for later and breeds you're interested in
          </Text>
        </Box>

        {!hasItems ? (
          <Box textAlign="center" py={12}>
            <FiHeart size={64} color="gray" />
            <Heading size="md" color="gray.600" mt={4}>
              Your wishlist is empty
            </Heading>
            <Text color="gray.500" mt={2}>
              Start browsing and save items you're interested in!
            </Text>
            <HStack spacing={4} mt={6} justify="center">
              <Button colorScheme="blue" onClick={() => router.push('/dashboard/listings')}>
                Browse Listings
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/breeds')}>
                Explore Breeds
              </Button>
            </HStack>
          </Box>
        ) : (
          <Tabs colorScheme="brand" variant="soft-rounded" isLazy>
            <TabList justifyContent="center" mb={8}>
                <Tab>User Breeds ({savedUserBreeds.length})</Tab>
              <Tab>Breeds ({savedBreeds.length})</Tab>
            </TabList>

            <TabPanels>
                {/* User Breeds Tab */}
              <TabPanel p={0}>
                  {savedUserBreeds.length === 0 ? (
                    <Text textAlign="center" color="gray.500" py={8}>No saved user breeds yet.</Text>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {savedUserBreeds.map((item) => {
                          const userBreed = item.user_breeds;
                          const breed = userBreed?.breeds;
                          if (!userBreed || !breed) return null;
                          return (
                            <Card key={item.id} overflow="hidden" _hover={{ shadow: 'lg' }}>
                              <Box position="relative">
                                <Image
                                  src={(userBreed.images && userBreed.images[0]) || breed.featured_image_url || '/images/placeholder.jpg'}
                                  alt={breed.name}
                                  height="150px"
                                  width="100%"
                                  objectFit="cover"
                                />
                                <Box position="absolute" top={2} right={2}>
                                  <AddToWishlistButton 
                                    userBreedId={userBreed.id}
                                    notifyWhenAvailable={item.notify_when_available}
                                    size="sm"
                                    bg="white"
                                    borderRadius="full"
                                    boxShadow="sm"
                                  />
                            </Box>
                              </Box>
                              <CardBody p={4}>
                                <VStack align="stretch" spacing={2}>
                                  <Heading size="sm" textAlign="center" textTransform="capitalize">
                                    {breed.name}
                                  </Heading>
                                  <FormControl display="flex" alignItems="center" justifyContent="center">
                                    <FormLabel htmlFor={`userbreed-notify-${item.id}`} mb="0" fontSize="xs">
                                      Notify when available
                                    </FormLabel>
                                    <Switch
                                      id={`userbreed-notify-${item.id}`}
                                      size="sm"
                                      isChecked={item.notify_when_available}
                                      onChange={() => handleToggleNotification(item.id, item.notify_when_available)}
                                    />
                                  </FormControl>
                                  <Button
                                    size="sm"
                                    colorScheme="brand"
                                    variant="outline"
                                    onClick={() => router.push(`/dashboard/breeders/${userBreed.user_id}/breeds/${userBreed.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </VStack>
                              </CardBody>
                            </Card>
                      );
                    })}
                  </SimpleGrid>
                )}
              </TabPanel>

              {/* Breeds Tab */}
              <TabPanel p={0}>
                {savedBreeds.length === 0 ? (
                  <Text textAlign="center" color="gray.500" py={8}>No saved breeds yet.</Text>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    {savedBreeds.map((item) => {
                      const breed = item.breeds;
                      if (!breed) return null;

                      return (
                        <Card key={item.id} overflow="hidden" _hover={{ shadow: 'lg' }}>
                          <Box position="relative">
                            <Image
                              src={breed.featured_image_url || '/images/placeholder.jpg'}
                              alt={breed.name}
                              height="150px"
                              width="100%"
                              objectFit="cover"
                            />
                            <Box position="absolute" top={2} right={2}>
                                <AddToWishlistButton 
                                    breedId={item.breed_id}
                                    notifyWhenAvailable={item.notify_when_available}
                                    size="sm"
                                    bg="white"
                                    borderRadius="full"
                                    boxShadow="sm"
                                />
                            </Box>
                          </Box>
                          <CardBody p={4}>
                            <VStack align="stretch" spacing={2}>
                              <Heading size="sm" textAlign="center" textTransform="capitalize">
                                {breed.name}
                              </Heading>

                              <FormControl display="flex" alignItems="center" justifyContent="center">
                                <FormLabel htmlFor={`breed-notify-${item.id}`} mb="0" fontSize="xs">
                                  Notify when available
                                </FormLabel>
                                <Switch
                                  id={`breed-notify-${item.id}`}
                                  size="sm"
                                  isChecked={item.notify_when_available}
                                  onChange={() => handleToggleNotification(item.id, item.notify_when_available)}
                                />
                              </FormControl>

                              <Button
                                size="sm"
                                colorScheme="brand"
                                variant="outline"
                                onClick={() => router.push(`/dashboard/breeds`)} // Ideally filter by breed
                              >
                                View Details
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
    </Container>
  );
};

export default WishlistPage;
