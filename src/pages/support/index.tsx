import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { FiSearch, FiMessageSquare, FiHelpCircle } from "react-icons/fi";
import Head from "next/head";
import { SupportFAQ } from "../../lib/components/ui/SupportFAQ";
import { SupportTicketForm } from "../../lib/components/ui/SupportTicketForm";
import {
  useSupportFAQs,
  useFAQSearch,
} from "../../lib/hooks/queries/useSupportFAQs";
import { useSupportCategories } from "../../lib/hooks/queries/useSupportCategories";
import { useCurrentUser } from "../../lib/hooks/queries/useAuth";

const SupportPage = () => {
  const {
    isOpen: isTicketModalOpen,
    onOpen: onTicketModalOpen,
    onClose: onTicketModalClose,
  } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: categories = [] } = useSupportCategories();
  const { data: allFAQs = [] } = useSupportFAQs();
  const { data: searchResults = [] } = useFAQSearch(searchQuery);

  // Filter FAQs by category if selected
  const displayedFAQs = selectedCategory
    ? allFAQs.filter((faq) => faq.category_id === selectedCategory)
    : searchQuery
    ? searchResults
    : allFAQs;

  const handleTicketCreated = () => {
    setShowTicketSuccess(true);
    setTimeout(() => setShowTicketSuccess(false), 5000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Head>
        <title>Support & Help Center - Pethouse</title>
        <meta
          name="description"
          content="Get help with your Pethouse experience. Browse FAQs or create a support ticket."
        />
      </Head>

      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Icon as={FiHelpCircle} boxSize={12} color="blue.500" mb={4} />
            <Text fontSize="3xl" fontWeight="bold" mb={2}>
              How can we help you?
            </Text>
            <Text fontSize="lg" color="gray.600" mb={6}>
              Browse our frequently asked questions or get in touch with our
              support team
            </Text>
          </Box>

          {/* Search and Filters */}
          <HStack spacing={4} align="stretch" flexWrap="wrap">
            <InputGroup maxW="400px">
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>

            <Select
              placeholder="All categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              maxW="200px"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>

            {currentUser ? (
              <Button
                leftIcon={<FiMessageSquare />}
                colorScheme="blue"
                onClick={onTicketModalOpen}
              >
                Create Ticket
              </Button>
            ) : (
              <Button
                leftIcon={<FiMessageSquare />}
                variant="outline"
                onClick={() => {
                  // Redirect to login or show message
                  window.location.href = "/login?redirect=/support";
                }}
              >
                Sign In to Create Ticket
              </Button>
            )}
          </HStack>

          {/* Success Message */}
          {showTicketSuccess && (
            <Box
              p={4}
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="md"
              color="green.800"
            >
              <Text fontWeight="semibold">
                Support ticket created successfully!
              </Text>
              <Text fontSize="sm" mt={1}>
                Our team will get back to you within 24 hours. Check your email
                for updates.
              </Text>
            </Box>
          )}

          {/* FAQ Section */}
          <Box>
            <HStack justify="space-between" align="center" mb={6}>
              <Text fontSize="2xl" fontWeight="bold">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Frequently Asked Questions"}
              </Text>
              <Text color="gray.500" fontSize="sm">
                {displayedFAQs.length}{" "}
                {displayedFAQs.length === 1 ? "question" : "questions"}
              </Text>
            </HStack>

            {displayedFAQs.length > 0 ? (
              <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={4}>
                {displayedFAQs.map((faq) => (
                  <SupportFAQ
                    key={faq.id}
                    faq={faq}
                    showCategory={true}
                    showVotes={!!currentUser}
                    showViewCount={true}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={12}>
                <Icon as={FiSearch} boxSize={12} color="gray.400" mb={4} />
                <Text fontSize="lg" color="gray.600" mb={2}>
                  {searchQuery
                    ? "No FAQs found matching your search"
                    : "No FAQs available in this category"}
                </Text>
                <Text fontSize="sm" color="gray.500" mb={4}>
                  {searchQuery
                    ? "Try different keywords or browse all categories"
                    : "Check back later or create a support ticket"}
                </Text>
                {selectedCategory && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory("")}
                    mb={4}
                  >
                    Show All Categories
                  </Button>
                )}
                {currentUser && (
                  <Button colorScheme="blue" onClick={onTicketModalOpen}>
                    Create Support Ticket
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {/* Contact Section */}
          {!searchQuery && displayedFAQs.length > 0 && (
            <Box bg="blue.50" p={8} borderRadius="lg" textAlign="center">
              <Icon as={FiMessageSquare} boxSize={8} color="blue.500" mb={4} />
              <Text fontSize="xl" fontWeight="semibold" mb={2}>
                Still need help?
              </Text>
              <Text color="gray.600" mb={4}>
                Can't find what you're looking for? Our support team is here to
                help.
              </Text>
              {currentUser ? (
                <Button
                  size="lg"
                  colorScheme="blue"
                  leftIcon={<FiMessageSquare />}
                  onClick={onTicketModalOpen}
                >
                  Create Support Ticket
                </Button>
              ) : (
                <VStack spacing={3}>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    leftIcon={<FiMessageSquare />}
                    onClick={() => {
                      window.location.href = "/login?redirect=/support";
                    }}
                  >
                    Sign In to Create Ticket
                  </Button>
                  <Text fontSize="sm" color="gray.600">
                    Sign in to access personalized support and track your
                    tickets
                  </Text>
                </VStack>
              )}
            </Box>
          )}
        </VStack>
      </Container>

      {/* Support Ticket Modal */}
      <SupportTicketForm
        isOpen={isTicketModalOpen}
        onClose={onTicketModalClose}
        onSuccess={handleTicketCreated}
      />
    </>
  );
};

export default SupportPage;
