import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Avatar,
  Button,
  Icon,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiMapPin,
  FiUsers,
  FiShield,
  FiList,
} from "react-icons/fi";
import { useRouter } from "next/router";

const AdminBreedDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [breed, setBreed] = useState(null);
  const [userBreeds, setUserBreeds] = useState([]);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Mock data for demonstration
  useEffect(() => {
    if (id) {
      setBreed({
        id,
        name: "Golden Retriever",
        pet_type: "dog",
        description:
          "Friendly and intelligent breed known for its loyalty and trainability.",
        created_at: "2024-01-01",
      });

      setUserBreeds([
        {
          id: "1",
          title: "Beautiful Golden Retriever Puppies",
          description: "Healthy and well-socialized puppies available now",
          price: 1500,
          users: {
            display_name: "John Smith",
            email: "john@example.com",
          },
          created_at: "2024-01-15",
        },
        {
          id: "2",
          title: "Golden Retriever Adult Dog",
          description: "Well-trained adult dog looking for new home",
          price: 800,
          users: {
            display_name: "Sarah Johnson",
            email: "sarah@example.com",
          },
          created_at: "2024-01-10",
        },
      ]);
    }
  }, [id]);

  if (!breed) {
    return (
      <Box maxW="7xl" mx="auto" px={6} py={8}>
        <Text>Loading breed details...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" px={6} py={8}>
      {/* Header */}
      <VStack spacing={6} align="stretch" mb={8}>
        <HStack spacing={4} align="center">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => router.push("/dashboard/admin/breeds")}
          >
            Back to Breeds
          </Button>
        </HStack>

        <HStack spacing={4} align="center">
          <Avatar size="xl" name={breed.name} bg="blue.500" color="white" />
          <Box>
            <HStack mb={2}>
              <Heading size="xl" color="blue.600">
                {breed.name}
              </Heading>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                {breed.pet_type}
              </Badge>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              {breed.description}
            </Text>
          </Box>
        </HStack>

        {/* Breed Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Box
            bg="blue.50"
            border="1px"
            borderColor="blue.200"
            borderRadius="md"
            p={4}
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium" color="blue.600">
                Total User Breeds
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                {userBreeds.length}
              </Text>
            </VStack>
          </Box>

          <Box
            bg="green.50"
            border="1px"
            borderColor="green.200"
            borderRadius="md"
            p={4}
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium" color="green.600">
                Active Listings
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.700">
                0
              </Text>
            </VStack>
          </Box>

          <Box
            bg="purple.50"
            border="1px"
            borderColor="purple.200"
            borderRadius="md"
            p={4}
          >
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={FiUsers} color="purple.500" />
                <Text fontSize="sm" fontWeight="medium" color="purple.600">
                  Breeders
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                {new Set(userBreeds.map((ub) => ub.users.email)).size}
              </Text>
            </VStack>
          </Box>

          <Box
            bg="orange.50"
            border="1px"
            borderColor="orange.200"
            borderRadius="md"
            p={4}
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium" color="orange.600">
                Created
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.700">
                {new Date(breed.created_at).toLocaleDateString()}
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>

      {/* User Breeds List */}
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
      >
        <HStack justify="space-between" mb={6}>
          <Heading size="md">User Breeds for {breed.name}</Heading>
          <Button leftIcon={<FiEdit />} variant="outline">
            Edit Breed
          </Button>
        </HStack>

        {userBreeds.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Icon as={FiUser} boxSize={12} color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No user breeds found for this breed
            </Text>
            <Text fontSize="sm" color="gray.400">
              Breeders haven't created any listings for this breed yet
            </Text>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Listing</Th>
                  <Th>Breeder</Th>
                  <Th>Price</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userBreeds.map((userBreed) => (
                  <Tr key={userBreed.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{userBreed.title}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {userBreed.description?.slice(0, 50)}...
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <HStack>
                        <Avatar
                          size="sm"
                          name={
                            userBreed.users.display_name ||
                            userBreed.users.email
                          }
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="medium">
                            {userBreed.users.display_name || "No name"}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {userBreed.users.email}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      {userBreed.price ? (
                        <Text fontWeight="medium">
                          Ksh. {userBreed.price.toLocaleString()}
                        </Text>
                      ) : (
                        <Text color="gray.400">-</Text>
                      )}
                    </Td>
                    <Td>
                      <HStack>
                        <Icon as={FiMapPin} color="gray.400" />
                        <Text fontSize="sm">Location</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme="green">Available</Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {new Date(userBreed.created_at).toLocaleDateString()}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button leftIcon={<FiEye />} size="sm" variant="ghost">
                          View
                        </Button>
                        <Button leftIcon={<FiEdit />} size="sm" variant="ghost">
                          Edit
                        </Button>
                        <Button
                          leftIcon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminBreedDetailPage;
