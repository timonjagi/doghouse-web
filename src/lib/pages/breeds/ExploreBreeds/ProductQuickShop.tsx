import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  DarkMode,
  Heading,
  HStack,
  Icon,
  IconButton,
  LightMode,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FiArrowRight, FiClock, FiHeart } from "react-icons/fi";
import { RiRulerLine } from "react-icons/ri";
import { Gallery } from "./Gallery";
import { Rating } from "./Rating";
import { ColorPicker } from "./ColorPicker";
import { PriceTag } from "./PriceTag";
import { ProductBadge } from "./ProductBadge";
import { QuantityPicker } from "./QuantityPicker";
import { SizePicker } from "./SizePicker";
import { Product } from "./_data";
import Link from "next/link";
import EthicalQuestionairreCard from "../../account/profile/EthicalQuestionairreCard";

interface ProductQuickShopProps {
  product: Product;
  rootProps?: StackProps;
}

export const ProductQuickShop = (props: ProductQuickShopProps) => {
  const { product, rootProps } = props;
  return (
    <Stack
      direction="column"
      spacing={{ base: "8", lg: "8" }}
      {...rootProps}
      w="full"
      justify="space-between"
    >
      <Stack flex="1" w={{ base: "100%", lg: "50%" }}>
        <Stack spacing="4">
          <ProductBadge bg="brand.500" color="white">
            Featured Breed
          </ProductBadge>

          <HStack alignSelf="baseline" justify="space-between" w="full">
            <Stack spacing="1">
              <Heading size="sm" fontWeight="medium">
                German Spitz
              </Heading>
              <Text as="span" fontWeight="medium" color="gray.600">
                Toy Group
              </Text>
            </Stack>
            <IconButton
              icon={<FiHeart />}
              aria-label="Add to Favorites"
              variant="outline"
              size="lg"
              fontSize="md"
            />

            {/*  <Stack>
              <Rating defaultValue={product.rating} size="sm" />
              <Link
                href="#"
                fontSize="sm"
                fontWeight="medium"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                {product.ratingCount} Reviews
              </Link>
            </Stack> */}
          </HStack>

          <Box flex="1">{/* <Gallery images={product.images} /> */}</Box>
        </Stack>

        <Stack>
          <ColorPicker
            defaultValue="Black"
            options={[
              { label: "Black", value: "#000" },
              { label: "Dark Gray", value: "#666" },
              { label: "Light Gray", value: "#BBB" },
            ]}
          />

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
              {product.description}
            </Text>
          </Stack>
        </Box>
        <Stack flex="1" spacing="4">
          <Text textAlign="center" as={Link} href="/breeds/german-spitz">
            View full details
          </Text>

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
      </Stack>
    </Stack>
  );
};
