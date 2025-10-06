import {
  Box,
  Button,
  Heading,
  Text,
  useColorMode,
  Flex,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const Page404 = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  return (
    <Flex minHeight="70vh" direction="column" justifyContent="center">
      <NextSeo title="404 Not Found" />

      <Box marginY={4}>
        <Heading textAlign="center" size="lg">
          Page not Found~~
        </Heading>

        <Box textAlign="center" marginTop={4}>
          <Text fontSize="lg" fontWeight="semibold" color="gray">
            It&apos;s Okay!
          </Text>
          <Button
            colorScheme="brand"
            onClick={() => router.back()}
            backgroundColor={colorMode === "light" ? "gray.300" : "teal.500"}
            size="lg"
            mt="8"
          >
            Let&apos;s Head Back
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default Page404;
