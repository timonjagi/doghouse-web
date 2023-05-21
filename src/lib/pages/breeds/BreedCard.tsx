import {
  Skeleton,
  AspectRatio,
  Stack,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
// import { useRouter } from "next/router";

// eslint-disable-next-line
export const BreedCard = ({ hit, status }: any) => {
  // const router = useRouter();
  return (
    <Box position="relative" key={hit.name} borderRadius="xl" overflow="hidden">
      <Skeleton
        isLoaded={status === "idle"}
        bg="brand.500"
        color="white"
        fadeDuration={2}
      >
        <Link
          href={`/breeds?breedName=${hit.name}`}
          as={`/breeds/${hit.name.replaceAll(" ", "-")}`}
        >
          <AspectRatio ratio={1}>
            <Image src={hit.image} alt={hit.name} fallback={<Skeleton />} />
          </AspectRatio>
          <Box
            position="absolute"
            inset="0"
            bgGradient="linear(to-b, transparent 60%, gray.900)"
            boxSize="full"
          />
          <Box
            position="absolute"
            bottom="6"
            width="full"
            textAlign="start"
            px={4}
            blur="2px"
          >
            <Stack spacing="1">
              <Text color="white" fontSize="lg" fontWeight="semibold">
                {hit.name}
              </Text>

              <Text color="white" fontSize="sm" fontWeight="light">
                {hit.breedGroup.substring(0, hit.breedGroup.length - 1)}
              </Text>
            </Stack>
          </Box>
        </Link>
      </Skeleton>
    </Box>
  );
};
