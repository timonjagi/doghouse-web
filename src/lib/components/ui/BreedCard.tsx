import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  useColorModeValue,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { GiDogHouse } from "react-icons/gi";

interface BreedCardProps {
  userBreed: any;
  userRole: 'seeker' | 'breeder' | 'admin';
  onClick?: () => void;
}

export const BreedCard = ({ userBreed, userRole, onClick }: BreedCardProps) => {
  const breed = userBreed.breeds;

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const brandColor = useColorModeValue("brand.600", "brand.400");
  const brandIconColor = useColorModeValue("brand.400", "brand.300");
  const starColor = useColorModeValue("yellow.400", "yellow.300");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  if (!breed) {
    return null;
  }

  const featuredImage = userRole === 'seeker' ? breed.featured_image_url : userBreed?.images && userBreed?.images[0] || '/images/placeholder-breed.jpg';
  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
        borderColor: "gray.200"
      }}
      position="relative"
    >
      {/* Breed Image */}
      <Box position="relative" overflow="hidden">
        <Image
          src={featuredImage}
          alt={breed.name}
          objectFit="cover"
          aspectRatio="1/1"
          width="100%"
          height="100%"
          fallback={<Skeleton width="100%" height="100%" />}
        />
      </Box>

      {/* Breed Info */}
      <VStack p={4} align="stretch" spacing={2}>
        <VStack align="stretch" spacing={1}>

          <Text fontSize="lg" fontWeight="semibold" noOfLines={2}>
            {breed.name}
          </Text>
          <HStack justify="space-between" align="center">

            {/* {breed.group && (
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                {breed.group}
              </Badge>
            )} */}

            {userRole === 'seeker' && userBreed.breeder_count && (
              <HStack spacing={1}>
                <Icon as={GiDogHouse} color={brandIconColor} boxSize={3} />
                <Text fontSize="xs" color={brandColor} fontWeight="medium">
                  {userBreed.breeder_count} breeder{userBreed.breeder_count !== 1 ? 's' : ''}
                </Text>
              </HStack>
            )}

            {/* Image count indicator */}
            {userRole === 'breeder' && userBreed.images && userBreed.images.length > 0 && (
              <HStack spacing={1}>
                <StarIcon color={starColor} boxSize={3} />
                <Text fontSize="xs" color={mutedTextColor}>
                  {userBreed.images.length} photo{userBreed.images.length !== 1 ? 's' : ''}
                </Text>
              </HStack>
            )}
          </HStack>

          {breed.description && userRole === 'breeder' && (
            <Text fontSize="sm" color={textColor} noOfLines={2}>
              {breed.description}
            </Text>
          )}
        </VStack>

        {/* User-specific info */}
        {userRole === 'breeder' && userBreed.notes && (
          <Text fontSize="xs" color={mutedTextColor} noOfLines={2}>
            Notes: {userBreed.notes}
          </Text>
        )}




      </VStack>
    </Box>
  );
};
