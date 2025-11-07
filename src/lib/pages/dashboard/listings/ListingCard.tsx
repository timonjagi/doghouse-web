import { Card, CardBody, Skeleton, Divider, VStack, Box, Heading, HStack, Badge, Image, Text, useColorModeValue, Icon } from '@chakra-ui/react'
import React from 'react'
import { MdLocationOn } from 'react-icons/md';

interface ListingCardProps {
  listing: any;
  handleListingClick: (id: string) => void;
  getStatusColor: (status: string) => string;
  bgColor?: string;
  formatPrice: (price: number) => string;
}

function ListingCard({
  listing,
  handleListingClick,
  getStatusColor,
  bgColor,
  formatPrice
}: ListingCardProps) {
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
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      cursor="pointer"
      onClick={() => handleListingClick(listing.id)}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
        borderColor: "gray.200"
      }}
    >
      {/* Main Photo */}
      {listing.photos && listing.photos.length > 0 && (
        <Box position="relative" height="200px" overflow="hidden">
          <Image
            src={listing.photos[0]}
            alt={listing.title}
            objectFit="cover"
            w="full"
            h="200px"
            mb={4}
            fallback={<Skeleton width="100%" height="100%" />}
            fallbackSrc='images/logo_white.png'
            loading="lazy"
          />

          <HStack position="absolute" top={2} right={2} spacing={2}>
            <Badge colorScheme={listing.type === 'litter' ? 'blue' : 'green'}>
              {listing.type === 'litter' ? 'Litter' : 'Single Pet'}
            </Badge>
            {/* <Badge colorScheme={getStatusColor(listing.status)}>
              {listing.status}
            </Badge> */}
          </HStack>
        </Box>
      )}

      <VStack spacing={2} align="stretch" p={4}>

        <Text size="xl" fontWeight="semibold" noOfLines={2}>
          {getTitle()}
        </Text>


        {listing.type === 'single_pet' && <Text fontSize="xs" color="gray.600" noOfLines={2}>
          {listing.pet_age} old • {listing.pet_gender}
        </Text>}

        {listing.type === 'litter' && <Text fontSize="xs" color="gray.600" noOfLines={2}>
          {listing.number_of_puppies} puppies • {getAge()} months old
        </Text>}

        {listing.location_text && (
          <HStack align="center" spacing={1} mb={2}>
            <Icon as={MdLocationOn} boxSize={4} color="gray.500" />
            <Text fontSize="xs" color="gray.500">
              {listing.location_text}
            </Text>
          </HStack>
        )}


        {/* <Text fontSize="xs" color="gray.600" noOfLines={2}>
          {listing.description}
        </Text> */}

        <Text fontSize="lg" fontWeight="semibold" color="brand.600">
          {formatPrice(listing.price)}
        </Text>


        {/* <Text fontSize="xs" color="gray.500">
                              👁️ {listing.view_count || 0} views
                            </Text> */}
      </VStack>
    </Box>
  )
}

export default ListingCard