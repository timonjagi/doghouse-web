import {
  Box,
  Container,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

import BlogPostCard from "./BlogPostCard";
import { posts } from "./data";
import Footer from "lib/components/layout/Footer";
// import client from "../../../../client";
// import groq from "groq";

const Blog = () => {
  return (
    <Box bg="bg-surface">
      <Box bg="bg-accent" color="on-accent">
        <Container
          pt={{
            base: "16",
            md: "24",
          }}
          pb={{
            base: "32",
            md: "48",
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
                  Our Blog
                </Text>
                <Heading
                  size={useBreakpointValue({
                    base: "md",
                    md: "lg",
                  })}
                >
                  Latest blog posts
                </Heading>

                <Text
                  fontSize={{
                    base: "lg",
                    md: "xl",
                  }}
                  maxW="2xl"
                  color="on-accent-muted"
                >
                  Stay updated with the latest news, tips, and insights
                </Text>
              </Stack>
            </Stack>
            <InputGroup
              size="lg"
              maxW={{
                md: "sm",
              }}
            >
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="on-accent" boxSize="5" />
              </InputLeftElement>
              <Input placeholder="Search" variant="filled" colorScheme="blue" />
            </InputGroup>
          </Stack>
        </Container>
      </Box>
      <Container
        pb={{
          base: "16",
          md: "24",
        }}
        mt={{
          base: "-16",
          md: "-24",
        }}
      >
        <Stack
          spacing={{
            base: "16",
            md: "24",
          }}
        >
          <Stack
            spacing={{
              base: "12",
              md: "16",
            }}
          >
            {posts && posts.length && <BlogPostCard post={posts[0]} isHero />}
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
                  .slice(1, 4)
                  .map((post) => <BlogPostCard key={post.id} post={post} />)}
            </SimpleGrid>
          </Stack>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
};

// export async function getStaticProps() {
//   const posts = await client.fetch(groq`
//     *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
//   `);

//   console.log(posts);
//   return {
//     props: {
//       posts,
//     },
//   };
// }

export default Blog;
