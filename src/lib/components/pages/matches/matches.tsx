import React from 'react';
import {
  Container,
  Heading,
  Text,
  VStack,
  Box,
  SimpleGrid,
  Avatar,
  HStack,
  Badge,
  Card,
  CardBody,
  Button,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCurrentUser } from "lib/hooks/queries/useAuth";
import { useBreederMatches } from "lib/hooks/queries/useWishlist";
import { FiMessageSquare, FiHeart, FiActivity } from "react-icons/fi";
import { useRouter } from "next/router";

const MatchesPage = () => {
  const { data: user } = useCurrentUser();
  
  const role = user?.user_metadata?.role;
  const isBreeder = role === 'breeder';

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            {isBreeder ? "My Leads & Matches" : "My Matches"}
          </Heading>
          <Text color="gray.600">
            {isBreeder 
              ? "Connect with people interested in your dogs and listings" 
              : "View personalized recommendations based on your preferences"}
          </Text>
        </Box>

        {isBreeder ? (
          <BreederLeadsView />
        ) : (
          <SeekerMatchesView />
        )}
      </VStack>
    </Container>
  );
};

const BreederLeadsView = () => {
  const { data: matches, isLoading, error } = useBreederMatches();
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.700');

  if (isLoading) {
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="xl" color="brand.500" />
        <Text mt={4} color="gray.500">Loading your leads...</Text>
      </Box>
    );
  }

  if (error) {
    return (
        <Alert status="error" borderRadius="md">
            <AlertIcon />
            Error loading leads. Please try again.
        </Alert>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Box textAlign="center" py={12} borderWidth={1} borderRadius="lg" bg={cardBg}>
        <Icon as={FiActivity} boxSize={12} color="gray.400" mb={4} />
        <Heading size="md" mb={2} color="gray.600">No leads yet</Heading>
        <Text color="gray.500" maxW="md" mx="auto">
            When users wishlist your listings or subscribe to your kennel, they will appear here.
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {matches.map((match: any) => (
        <Card key={match.id} variant="outline" _hover={{ shadow: 'md' }} bg={cardBg}>
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack spacing={4}>
                <Avatar 
                    src={match.users?.profile_photo_url} 
                    name={match.users?.display_name} 
                    size="md"
                />
                <Box>
                  <Text fontWeight="bold">{match.users?.display_name || 'Anonymous User'}</Text>
                  <Text fontSize="xs" color="gray.500">
                    Interested since {new Date(match.created_at).toLocaleDateString()}
                  </Text>
                </Box>
              </HStack>

              <Box w="full">
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                    Interest:
                </Text>
                {match.listing_id && match.listings ? (
                    <HStack p={2} bg="blue.50" borderRadius="md" width="full" spacing={3}>
                         <Box 
                            w="40px" h="40px" 
                            bgImage={match.listings.photos?.[0] ? `url(${match.listings.photos[0]})` : undefined} 
                            bgSize="cover" 
                            bgPos="center" 
                            borderRadius="md"
                            bgColor="gray.200"
                            flexShrink={0}
                         />
                         <Box overflow="hidden">
                            <Badge colorScheme="blue" mb={1} fontSize="xs">Listing</Badge>
                            <Text fontSize="sm" noOfLines={1} fontWeight="medium">{match.listings.title}</Text>
                         </Box>
                    </HStack>
                ) : match.user_breed_id && match.user_breeds ? (
                    <HStack p={2} bg="green.50" borderRadius="md" width="full">
                        <Icon as={FiHeart} color="green.500" boxSize={5} mr={2} />
                        <Box>
                            <Badge colorScheme="green" mb={1} fontSize="xs">Subscriber</Badge>
                            <Text fontSize="sm">Follows your {match.user_breeds.breeds?.name}</Text>
                        </Box>
                    </HStack>
                ) : (
                    <Badge>General Interest</Badge>
                )}
              </Box>

              <Button 
                leftIcon={<FiMessageSquare />} 
                width="full" 
                size="sm" 
                colorScheme="brand"
                variant="outline"
                onClick={() => {
                    // Navigate to chat
                    router.push('/dashboard/inbox')
                }}
              >
                Message
              </Button>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

const SeekerMatchesView = () => {
    return (
        <Box textAlign="center" py={12} borderWidth={1} borderRadius="lg" borderStyle="dashed">
            <Text color="gray.500" fontStyle="italic">
                Matches interface coming soon...
            </Text>
            <Text fontSize="sm" color="gray.400" mt={2}>
                We are working on personalized recommendations for you.
            </Text>
        </Box>
    );
};

export default MatchesPage;
