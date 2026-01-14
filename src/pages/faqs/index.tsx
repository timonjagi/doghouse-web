import {
  Box,
  Container,
  Heading,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  HStack,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiHelpCircle } from "react-icons/fi";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { SupportFAQ } from "../../lib/components/ui/SupportFAQ";
import {
  useSupportFAQs,
  useFAQSearch,
} from "../../lib/hooks/queries/useSupportFAQs";
import { useSupportCategories } from "../../lib/hooks/queries/useSupportCategories";
import { SearchInput } from "../../lib/components/layout/SearchInput";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: categories = [] } = useSupportCategories();
  const { data: allFAQs = [] } = useSupportFAQs();
  const { data: searchResults = [] } = useFAQSearch(searchQuery);

  // Filter FAQs by category if selected
  const displayedFAQs = selectedCategory
    ? allFAQs.filter((faq) => faq.category_id === selectedCategory)
    : searchQuery
    ? searchResults
    : allFAQs;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Search is handled by SearchInput component
    }
  };

  return (
    <>
      <Head>
        <title>FAQs | Pethouse Kenya</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Pethouse Kenya. Learn about pet adoption, breeder verification, and more."
        />
        <meta
          name="keywords"
          content="FAQs, frequently asked questions, help, support, pet adoption, breeders, Pethouse Kenya"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <NextSeo
        title="FAQs | Pethouse Kenya"
        description="Find answers to frequently asked questions about Pethouse Kenya. Learn about pet adoption, breeder verification, and more."
        openGraph={{
          title: "FAQs | Pethouse Kenya",
          description:
            "Find answers to frequently asked questions about Pethouse Kenya. Learn about pet adoption, breeder verification, and more.",
          images: [
            {
              url: "/images/logo.png",
              width: 1200,
              height: 630,
              alt: "Pethouse Kenya - FAQs",
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "FAQs, frequently asked questions, help, support, pet adoption, breeders, Pethouse Kenya",
          },
          {
            name: "robots",
            content: "index, follow",
          },
        ]}
      />

      {/* Header Section - Similar to Explore Page */}
      <Box bg="bg-accent" color="on-accent">
        <Container
          pt={{
            base: "16",
            md: "24",
          }}
          pb={{
            base: "16",
            md: "24",
          }}
        >
          <Stack
            spacing={{
              base: "8",
              md: "10",
            }}
            align="center"
          >
            <Stack
              spacing={{
                base: "4",
                md: "6",
              }}
              textAlign="center"
            >
              <Stack spacing="4">
                <Text
                  fontWeight="semibold"
                  color="blue.50"
                  fontSize={{
                    base: "sm",
                    md: "md",
                  }}
                >
                  Help Center
                </Text>
                <Heading
                  size={useBreakpointValue({
                    base: "md",
                    md: "lg",
                  })}
                >
                  Frequently Asked Questions
                </Heading>

                <Text
                  fontSize={{
                    base: "lg",
                    md: "xl",
                  }}
                  maxW="2xl"
                  color="on-accent-muted"
                >
                  Find answers to common questions about pet adoption, breeder
                  verification, and using Pethouse Kenya.
                </Text>
              </Stack>
            </Stack>

            {/* Search Input - Similar to Explore Page */}
            <SearchInput
              placeholder="Search FAQs..."
              variant="filled"
              colorScheme="brand"
              iconColor="on-brand"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              onClear={() => setSearchQuery("")}
              maxW={{
                md: "sm",
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* FAQ Content */}
      <Container maxW="5xl" bg="bg-surface" py={{ base: 8, md: 12 }}>
        <VStack spacing={8} align="stretch">
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
              <VStack spacing={6} align="stretch">
                {/* Group FAQs by category */}
                {categories.map((category) => {
                  const categoryFAQs = displayedFAQs.filter(
                    (faq) => faq.category_id === category.id
                  );

                  if (categoryFAQs.length === 0) return null;

                  return (
                    <Box key={category.id}>
                      <Text
                        fontSize="xl"
                        fontWeight="semibold"
                        mb={4}
                        color="gray.700"
                      >
                        {category.name}
                      </Text>
                      <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={4}>
                        {categoryFAQs.map((faq) => (
                          <SupportFAQ
                            key={faq.id}
                            faq={faq}
                            showCategory={false}
                            showVotes={false}
                            showViewCount={true}
                          />
                        ))}
                      </SimpleGrid>
                    </Box>
                  );
                })}
              </VStack>
            ) : (
              <Box textAlign="center" py={12}>
                <Icon as={FiHelpCircle} boxSize={12} color="gray.400" mb={4} />
                <Text fontSize="lg" color="gray.600" mb={2}>
                  {searchQuery
                    ? "No FAQs found matching your search"
                    : "No FAQs available"}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {searchQuery
                    ? "Try different keywords"
                    : "Check back later for more questions"}
                </Text>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default FAQPage;
