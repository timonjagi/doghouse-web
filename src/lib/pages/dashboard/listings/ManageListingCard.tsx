import { HStack, VStack, Box, Badge, Image, Text, useColorModeValue, Skeleton } from '@chakra-ui/react';
import React from 'react'

interface ManageListingCardProps {
  listing: any;
  handleViewListing: (id: string) => void;
  getStatusColor: (status: string) => string;
  bgColor?: string;
  formatPrice: (price: number) => string;
}
function ManageListingCard({
  listing,
  handleViewListing,
  getStatusColor,
  bgColor,
  formatPrice
}: ManageListingCardProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const getTitle = () => {
    if (listing.title) return listing.title;
    if (listing.type === 'litter') {
      //@ts-ignore
      return `${listing.breeds?.name} Puppies for Sale`;
    } else {
      //@ts-ignore
      return `${listing.breeds?.name.charAt(0).toUpperCase() + listing.breeds?.name.slice(1)} ${listing.pet_age} old for Sale`;
    }
  }

  const getAge = () => {
    const today = new Date();
    const birthDate = new Date(listing.birth_date);
    // age in months 

    const age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    return age;
  }


  return (
    <Box
      key={listing.id}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      cursor="pointer"
      onClick={(e) => { e.stopPropagation(); return handleViewListing(listing.id) }}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
        borderColor: "gray.200"
      }}
    >
      {listing.photos && listing.photos.length > 0 && (
        <Box position="relative" height="200px" overflow="hidden">
          <Image
            src={listing.photos[0]}
            alt={listing.title}
            objectFit="cover"
            width="100%"
            height="100%"
            fallback={<Skeleton width="100%" height="100%" />}
          />

          <HStack position="absolute" top={2} right={2} spacing={2}>
            <Badge colorScheme={listing.type === 'litter' ? 'blue' : 'green'}>
              {listing.type === 'litter' ? 'Litter' : 'Single Pet'}
            </Badge>
            <Badge colorScheme={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
          </HStack>
        </Box>
      )}

      <VStack spacing={3} p={4} align="stretch">
        <Box>
          <Text size="lg" fontWeight='semibold' noOfLines={2}>
            {getTitle()}
          </Text>

          {listing.type === 'single_pet' && <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {listing.pet_age} old • {listing.pet_gender}
          </Text>}

          {listing.type === 'litter' && <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {listing.number_of_puppies} puppies • {getAge()} months old
          </Text>}
        </Box>


        <Text fontSize="lg" fontWeight="semibold" color="brand.600">
          {formatPrice(listing.price)} {listing.type === 'litter' && 'each'}
        </Text>
      </VStack>
    </Box>
  )
}

export default ManageListingCard