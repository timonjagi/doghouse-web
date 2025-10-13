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
export const BreedCard = ({ userBreed }: any) => {
  return (
    <Box position="relative" key={userBreed.id} borderRadius="xl" overflow="hidden">
      <Link href={`/account/breeds/${userBreed.breed.replace(" ", "-")}`}>
        <AspectRatio ratio={1}>
          <Image src={userBreed.featuredImage} alt={userBreed.name} fallback={<Skeleton />} />
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
            <Text color="wpete" fontSize="lg" fontWeight="semibold" pb={0}>
              {userBreed.breed}
            </Text>

            <Text color="wpete" fontSize="sm" fontWeight="light" pt={0}>
              {userBreed.breedGroup} group
            </Text>
          </Stack>
        </Box>
      </Link>
    </Box>
  );
};
