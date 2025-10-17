import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { EditIcon, ViewIcon, StarIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

// Local types for now - will fix imports later
interface Breed {
  id: string;
  name: string;
  description?: string;
  group?: string;
  featured_image_url?: string;
}

interface UserBreed {
  id: string;
  user_id: string;
  breed_id: string;
  is_owner: boolean;
  notes?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  breeds?: Breed;
}

interface BreedCardProps {
  userBreed: UserBreed;
  userRole: 'breeder' | 'seeker' | 'admin';
  onClick?: () => void;
}

export const BreedCard = ({ userBreed, userRole, onClick }: BreedCardProps) => {
  const router = useRouter();
  const breed = userBreed.breeds;

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!breed) {
    return null;
  }

  const handleCardClick = () => {
    router.push(`/dashboard/breeds/${userBreed.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const featuredImage = userRole === 'seeker' ? breed.featured_image_url : userBreed?.images && userBreed?.images[0] || '/images/placeholder-breed.jpg';
  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      cursor={userRole === 'seeker' ? "pointer" : "default"}
      onClick={handleCardClick}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
        borderColor: "brand.200"
      }}
      position="relative"
    >
      {/* Breed Image */}
      <Box position="relative" height="200px" overflow="hidden">
        <Image
          src={featuredImage}
          alt={breed.name}
          objectFit="cover"
          width="100%"
          height="100%"
          fallback={<Skeleton width="100%" height="100%" />}
        />
      </Box>

      {/* Breed Info */}
      <VStack p={4} align="stretch" spacing={2}>
        <VStack align="stretch" spacing={1}>
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
              {breed.name}
            </Text>
            {breed.group && (
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                {breed.group}
              </Badge>
            )}
          </HStack>

          {breed.description && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {breed.description}
            </Text>
          )}
        </VStack>

        {/* User-specific info */}
        {userRole === 'breeder' && userBreed.notes && (
          <Text fontSize="xs" color="gray.500" noOfLines={2}>
            Notes: {userBreed.notes}
          </Text>
        )}

        {userRole === 'seeker' && (
          <Text fontSize="xs" color="brand.600" fontWeight="medium">
            Available from breeders
          </Text>
        )}

        {/* Image count indicator */}
        {userBreed.images && userBreed.images.length > 0 && (
          <HStack spacing={1}>
            <StarIcon color="yellow.400" boxSize={3} />
            <Text fontSize="xs" color="gray.500">
              {userBreed.images.length} photo{userBreed.images.length !== 1 ? 's' : ''}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};
