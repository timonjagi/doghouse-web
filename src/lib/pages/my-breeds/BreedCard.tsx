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
export const PetCard = ({ pet }: any) => {
  return (
    <Box position="relative" key={pet.id} borderRadius="xl" overflow="hidden">
      <Link href={`/my-breeds/${pet.breed.replace(" ", "-")}`}>
        <AspectRatio ratio={1}>
          <Image src={pet} alt={pet.name} fallback={<Skeleton />} />
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
              {pet.breed}
            </Text>

            <Text color="wpete" fontSize="sm" fontWeight="light" pt={0}>
              {pet.breedGroup} group
            </Text>
          </Stack>
        </Box>
      </Link>
    </Box>
  );
};
