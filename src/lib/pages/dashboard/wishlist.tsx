import React from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Badge,
  Image,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiHeart, FiTrash2, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useWishlist, useRemoveFromWishlist, useToggleWishlistNotification, WishlistItem } from '../../../hooks/queries/useWishlist';
import { formatPrice } from '../../../components/ui/PriceTag';

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

  const handleViewItem = (item: WishlistItem) => {
    if (item.listing_id) {
      router.push(`/dashboard/listings/${item.listing_id}`);
    } else if (item.user_breed_id) {
      // Could navigate to breeder profile or breed page
      router.push(`/dashboard/breeders`);
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

  const listings = wishlistItems?.filter(item => item.listings) || [];
  const userBreeds = wishlistItems?.filter(item => item.user_breeds) || [];

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

        {(!wishlistItems || wishlistItems.length === 0) ? (
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
          <>
            {/* Listings Section */}
            {listings.length > 0 && (
              <Box>
                <Heading size="md" mb={4}>
                  Saved Listings ({listings.length})
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                  {listings.map((item) => {
                    const listing = item.listings;
                    if (!listing) return null;

                    return (
                      <Card key={item.id} overflow="hidden" _hover={{ shadow: 'lg' }}>
                        <Box position="relative">
                          <Image
                            src={listing.photos?.[0] || '/images/placeholder.jpg'}
                            alt={listing.title}
                            height="200px"
                            width="100%"
                            objectFit="cover"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Remove from wishlist"
                            position="absolute"
                            top={2}
                            right={2}
                            colorScheme="red"
                            variant="solid"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          />
                        </Box>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <Heading size="sm" noOfLines={2}>
                              {listing.title}
                            </Heading>

                            <HStack justify="space-between">
                              <Badge colorScheme="blue">
                                {formatPrice(listing.price)}
                              </Badge>
                              <Badge colorScheme={listing.status === 'available' ? 'green' : 'gray'}>
                                {listing.status}
                              </Badge>
                            </HStack>

                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor={`notify-${item.id}`} mb="0" fontSize="sm">
                                Notify when available
                              </FormLabel>
                              <Switch
                                id={`notify-${item.id}`}
                                isChecked={item.notify_when_available}
                                onChange={() => handleToggleNotification(item.id, item.notify_when_available)}
                              />
                            </FormControl>

                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleViewItem(item)}
                            >
                              View Details
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* User Breeds Section */}
            {userBreeds.length > 0 && (
              <Box>
                <Heading size="md" mb={4}>
                  Interested Breeds ({userBreeds.length})
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                  {userBreeds.map((item) => {
                    const userBreed = item.user_breeds;
                    const breed = userBreed?.breeds;
                    if (!userBreed || !breed) return null;

                    return (
                      <Card key={item.id} overflow="hidden" _hover={{ shadow: 'lg' }}>
                        <Box position="relative">
                          <Image
                            src={breed.featured_image_url || userBreed.images?.[0] || '/images/placeholder.jpg'}
                            alt={breed.name}
                            height="150px"
                            width="100%"
                            objectFit="cover"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Remove from wishlist"
                            position="absolute"
                            top={2}
                            right={2}
                            colorScheme="red"
                            variant="solid"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          />
                        </Box>
                        <CardBody p={4}>
                          <VStack align="stretch" spacing={2}>
                            <Heading size="sm" textAlign="center">
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
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => handleViewItem(item)}
                            >
                              View Breeders
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </Grid>
              </Box>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default WishlistPage;
