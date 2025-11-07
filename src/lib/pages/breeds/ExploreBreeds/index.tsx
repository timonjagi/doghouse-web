import {
  Box,
  HStack,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { FiHeart } from "react-icons/fi";

import { Gallery } from "./Gallery";
import { ProductBadge } from "./ProductBadge";

export const ExploreBreeds = () => {
  const images = [
    { id: 1, src: "golden_retriever_1", alt: "Golden Retriever" },
    { id: 2, src: "golden_retriever_2", alt: "Golden Retriever" },
    { id: 3, src: "golden_retriever_3", alt: "Golden Retriever" },
    { id: 4, src: "golden_retriever_4", alt: "Golden Retriever" },
    { id: 5, src: "golden_retriever_6", alt: "Golden Retriever" },
    { id: 6, src: "golden_retriever_8", alt: "Golden Retriever" },
    { id: 7, src: "golden_retriever_9", alt: "Golden Retriever" },
    { id: 8, src: "golden_retriever_10", alt: "Golden Retriever" },
    { id: 9, src: "golden_retriever_11", alt: "Golden Retriever" },
  ];

  return (
    <Box height="auto" bg="bg-surface" p="6">
      <Stack
        direction="column"
        spacing={{ base: "8", lg: "8" }}
        w="full"
        justify="space-between"
      >
        <Stack flex="1">
          <Stack spacing="4">
            <ProductBadge bg="secondary.300" color="white">
              Featured Breed
            </ProductBadge>

            <HStack alignSelf="baseline" justify="space-between" w="full">
              <Stack spacing="1">
                <Heading size="xs" fontWeight="medium">
                  Golden Retriever
                </Heading>
                <Text as="span" fontWeight="medium" color="gray.600">
                  Sporting Group
                </Text>
              </Stack>
              <IconButton
                icon={<FiHeart />}
                aria-label="Add to Favorites"
                variant="outline"
                size="lg"
                fontSize="md"
              />
            </HStack>

            <Box flex="1">
              <Gallery />
            </Box>
          </Stack>

          <Stack spacing="3">
            <Text textAlign="center" as={Link} href="/breeds/golden-retriever">
              View full details
            </Text>
            {/* <ColorPicker
              defaultValue="Black"
              options={[
                { label: "Black", value: "#000" },
                { label: "Dark Gray", value: "#666" },
                { label: "Light Gray", value: "#BBB" },
              ]}
            /> */}

            {/* <SizePicker
          defaultValue="32"
          options={[
            { label: "32mm", value: "32" },
            { label: "36mm", value: "36" },
            { label: "40mm", value: "40" },
          ]}
        /> */}
          </Stack>
        </Stack>
        {/* 
    <Stack flex="1">
      <Box flex="1">
        <Stack spacing={{ base: "2", md: "4" }}>
          <Stack
            direction="row"
            spacing="1"
            align="baseline"
            justify="space-between"
            w="full"
          ></Stack>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            {products[0].description}
          </Text>
        </Stack>
      </Box>
      <Stack flex="1" spacing="4">
      

        <Box bg="bg-accent">
          <LightMode>
            <Alert
              status="info"
              variant="subtle"
              bg="brand.500"
              color="white"
              colorScheme="primary"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Is this the right breed for you?
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Take our compatibility quiz and find out if this breed fits
                your unique lifestyle.
              </AlertDescription>
            </Alert>
          </LightMode>
        </Box>
        <HStack w="full" justify="space-between">
          <Button colorScheme="brand" size="lg" w="full">
            Request Breed
          </Button>
          <Button
            colorScheme="brand"
            size="lg"
            variant="ghost"
            rightIcon={<FiArrowRight />}
            w="full"
          >
            Take Quiz
          </Button>
        </HStack>
      </Stack>
    </Stack> */}
      </Stack>
    </Box>
  );
};
