import {
  Skeleton,
  AspectRatio,
  Stack,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

// eslint-disable-next-line
export const BreedCard = ({ hit }: any) => {
  return (
    <Box position="relative" key={hit.name} borderRadius="xl" overflow="hidden">
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
          bgGradient="linear(to-b, transparent 40%, gray.900)"
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
            <Text color="white" fontSize="lg" fontWeight="semibold" pb={0}>
              {hit.name}
            </Text>

            <Text color="white" fontSize="sm" fontWeight="light" pt={0}>
              {hit.breedGroup &&
                hit.breedGroup.substring(0, hit.breedGroup.length - 1)}
            </Text>
          </Stack>
        </Box>
      </Link>
    </Box>
  );
};
