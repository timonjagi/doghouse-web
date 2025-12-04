import {
  Skeleton,
  AspectRatio,
  Stack,
  Box,
  Image,
  Text,
  HStack,
  Badge,
  Icon,
} from "@chakra-ui/react";
import Link from "next/link";
import { ProductBadge } from "./ProductBadge";
import { StarIcon } from "@chakra-ui/icons";
import { GiDogHouse } from "react-icons/gi";

// eslint-disable-next-line
export const BreedCard = ({ userBreed, }: any) => {

  const breed = userBreed.breeds || userBreed;

  return (
    <Box
      position="relative"
      key={breed?.name}
      borderRadius="xl"
      overflow="hidden"
    >
      <Link
        href={`/dashboard/breeds/${encodeURIComponent(breed?.name?.toLowerCase().replaceAll(" ", "-") || '')}`}
      // as={`/breeds/${breed?.name.replaceAll(" ", "-")}`}
      >
        <Box position="relative">
          <AspectRatio ratio={1}>

            <Image
              src={breed?.featured_image_url}
              alt={breed?.name}
              fallback={<Skeleton />}
            />
          </AspectRatio>


        </Box>



        <Box
          position="absolute"
          bg="brand.100"
          boxSize="full"
        >
          <ProductBadge />
        </Box>

        <Box
          position="absolute"
          inset="0"
          // bg gradient both top and bottom
          bgGradient="linear(to-b, transparent 40%, gray.900)"


          boxSize="full"
        />

        <Box
          position="absolute"
          inset="0"
          // bg gradient both top right corner

          bgGradient="linear(to top right, transparent 50%, gray.900)"


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
          <Stack spacing="0">
            <Text color="white" fontSize="lg" fontWeight="semibold" pb={0}>
              {breed?.name}
            </Text>

            <Text color="white" fontSize="sm" fontWeight="light" pt={0}>
              {breed?.group} group
            </Text>
          </Stack>
        </Box>

        {userBreed.breeder_count && (

          <Badge
            position="absolute"
            top="2"
            right="2"
            textAlign="start"
            px={2}
            blur="2px"
            zIndex={1}
            variant="ghost"
            colorScheme="white"

          >

            <HStack spacing={1}>
              <Icon as={GiDogHouse} color="white" boxSize={3} />
              <Text fontSize="xs" color="white" fontWeight="medium">
                {userBreed.breeder_count} breeder{userBreed.breeder_count !== 1 ? 's' : ''}
              </Text>
            </HStack>

            {/* <HStack spacing="1">


              <Icon as={GiDogHouse} color="brand.100" boxSize={6} />
              
              <Text
                fontSize="md"
                color="brand.100"
                fontWeight="medium"
              >
                {userBreed.breeder_count}
              </Text> 

            <Box
              borderRadius="100%"
              bg="brand.100"
              mx="auto"
              position="absolute"
              top="4"
              right="-5"
            >
              <Text
                fontSize="xs"
                color="brand.600"
                fontWeight="medium"
              >
                {userBreed.breeder_count}
              </Text>

            </Box>


          </HStack>

          */}
          </Badge>
        )}
      </Link >
    </Box >
  );
};
