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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiShield,
  FiList,
  FiBarChart,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiArrowLeft,
} from "react-icons/fi";
import { useRouter } from "next/router";

const AdminBreedsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [petTypeFilter, setPetTypeFilter] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [stats, setStats] = useState({
    totalBreeds: 15,
    userBreedsCount: 45,
    listingsCount: 120,
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Mock data for demonstration
  useEffect(() => {
    setBreeds([
      {
        id: "1",
        name: "Golden Retriever",
        pet_type: "dog",
        description: "Friendly and intelligent breed",
        created_at: "2024-01-01",
      },
      {
        id: "2",
        name: "Labrador Retriever",
        pet_type: "dog",
        description: "Active and outgoing breed",
        created_at: "2024-01-02",
      },
      {
        id: "3",
        name: "Persian",
        pet_type: "cat",
        description: "Docile and sweet breed",
        created_at: "2024-01-03",
      },
    ]);
  }, []);

  const filteredBreeds = breeds.filter((breed) => {
    const matchesSearch =
      breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breed.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPetType = !petTypeFilter || breed.pet_type === petTypeFilter;
    return matchesSearch && matchesPetType;
  });

  return (
    <Box maxW="7xl" mx="auto" px={6} py={8}>
      {/* Header */}
      <VStack spacing={6} align="stretch" mb={8}>
        <HStack spacing={4} align="center">
          <Box p={2} bg="blue.500" borderRadius="md">
            <FiList size={24} color="white" />
          </Box>
          <Box>
            <Heading size="lg" color="blue.600">
              Breed Management
            </Heading>
            <Text color="gray.600">
              Manage all available breeds and their details
            </Text>
          </Box>
        </HStack>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box
            bg="blue.50"
            border="1px"
            borderColor="blue.200"
            borderRadius="md"
            p={4}
          >
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={FiList} color="blue.500" />
                <Text fontSize="sm" fontWeight="medium" color="blue.600">
                  Total Breeds
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                {stats.totalBreeds}
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
              <HStack>
                <Icon as={FiUsers} color="green.500" />
                <Text fontSize="sm" fontWeight="medium" color="green.600">
                  User Breeds
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.700">
                {stats.userBreedsCount}
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
                <Icon as={FiShield} color="purple.500" />
                <Text fontSize="sm" fontWeight="medium" color="purple.600">
                  Listings
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                {stats.listingsCount}
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>

      {/* Filters and Actions */}
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
        mb={8}
      >
        <HStack spacing={4} justify="space-between" mb={4}>
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search breeds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              placeholder="Filter by pet type"
              maxW="200px"
              value={petTypeFilter}
              onChange={(e) => setPetTypeFilter(e.target.value)}
            >
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="bird">Birds</option>
              <option value="other">Other</option>
            </Select>

            <Button leftIcon={<FiFilter />} variant="outline">
              More Filters
            </Button>
          </HStack>
          <Button leftIcon={<FiPlus />} colorScheme="blue">
            Add New Breed
          </Button>
        </HStack>
      </Box>

      {/* Breeds List */}
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
      >
        <VStack spacing={4} align="stretch">
          {filteredBreeds.map((breed) => (
            <Box
              key={breed.id}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              p={4}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={4}>
                  <Avatar
                    size="md"
                    name={breed.name}
                    bg="blue.500"
                    color="white"
                  />
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {breed.name}
                      </Text>
                      <Badge colorScheme="blue">{breed.pet_type}</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {breed.description}
                    </Text>
                  </VStack>
                </HStack>
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
              </HStack>
            </Box>
          ))}

          {filteredBreeds.length === 0 && (
            <Box textAlign="center" py={12}>
              <Icon as={FiList} boxSize={12} color="gray.400" mb={4} />
              <Text fontSize="lg" color="gray.500">
                No breeds found
              </Text>
              <Text fontSize="sm" color="gray.400" mb={4}>
                Try adjusting your search or filter criteria
              </Text>
              <Button leftIcon={<FiPlus />} colorScheme="blue">
                Add New Breed
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminBreedsPage;
