import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

import BlogPostCard from "../../blog/BlogPostCard";
import { posts } from "../../blog/data";

export const Blog = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const brandColor = useColorModeValue("brand.600", "brand.900");
  return (
    <Box bg="bg-surface" maxW="6xl">
      <Container py={{ base: "16", md: "24" }}>
        <Stack spacing={{ base: "12", md: "16" }}>
          <Stack direction="row" justify="space-between">
            <Stack spacing={{ base: "4", md: "5" }}>
              <Stack spacing="3">
                <Text
                  color="accent"
                  fontWeight="semibold"
                  fontSize={{ base: "md", md: "lg" }}
                >
                  Our Blog
                </Text>
                <Heading size={useBreakpointValue({ base: "md", md: "lg" })}>
                  Latest blog posts
                </Heading>
              </Stack>
              <Text color="muted" fontSize={{ base: "lg", md: "xl" }}>
                Read our blog for the latest news and updates
              </Text>
            </Stack>
            {!isMobile && (
              <HStack spacing={{ base: "2", md: "3" }}>
                <Text
                  as={Link}
                  fontWeight="semibold"
                  color={brandColor}
                  href="/blog"
                >
                  View More
                </Text>
                <Icon
                  as={FaArrowRight}
                  color={brandColor}
                  fontSize={{ base: "sm", md: "md" }}
                />
              </HStack>
            )}
          </Stack>
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            gap={{
              base: "12",
              lg: "8",
            }}
          >
            {posts &&
              posts
                .slice(0, 3)
                .map((post) => <BlogPostCard key={post.id} post={post} />)}
          </SimpleGrid>
          {isMobile && (
            <Button variant="primary" size="lg">
              Show all
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
