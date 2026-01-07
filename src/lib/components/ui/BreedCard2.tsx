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
import { AddToWishlistButton } from "./AddToWishlistButton";

// eslint-disable-next-line
export const BreedCard = ({
  userBreed,
  showWishlistButton = false,
  userBreedId,
  breedId,
}: any) => {
  const breed = userBreed.breeds || userBreed;
  const imageSrc = userBreed?.images?.[0] || breed?.featured_image_url;

  const getDetailUrl = () => {
    if (userBreed?.id) {
      // This is a user breed, link to breeder detail page
      return `/dashboard/breeders/${userBreed.user_id}/breeds/${userBreed.id}`;
    } else {
      // This is a general breed, link to breed detail page
      return `/dashboard/breeds/${encodeURIComponent(
        breed?.name?.toLowerCase().replaceAll(" ", "-") || ""
      )}`;
    }
  };

  return (
    <Box
      position="relative"
      key={breed?.name}
      borderRadius="xl"
      overflow="hidden"
      cursor="pointer"
    >
      <Link href={getDetailUrl()}>
        <Box position="relative">
          <AspectRatio ratio={1}>
            <Image src={imageSrc} alt={breed?.name} fallback={<Skeleton />} />
          </AspectRatio>

          {/* Wishlist button overlay */}
          {showWishlistButton && (
            <Box position="absolute" top={2} right={2} zIndex={10}>
              <AddToWishlistButton
                userBreedId={userBreedId}
                breedId={breedId}
                notifyWhenAvailable={true}
                size="sm"
                bg="white"
                borderRadius="full"
                boxShadow="sm"
              />
            </Box>
          )}
        </Box>

        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-b, transparent 40%, gray.900)"
          boxSize="full"
        />

        <Box
          position="absolute"
          inset="0"
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
      </Link>
    </Box>
  );
};
