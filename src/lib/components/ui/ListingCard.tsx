import { Skeleton, VStack, Box, HStack, Badge, Image, Text, useColorModeValue, Icon } from '@chakra-ui/react'
import { PriceTag } from 'lib/components/ui/PriceTag';
import React from 'react'
import { MdLocationOn } from 'react-icons/md';

interface ListingCardProps {
  listing: any;
  handleListingClick: (id: string) => void;
  bgColor?: string;
}

function ListingCard({
  listing,
  handleListingClick,
  bgColor,

}: ListingCardProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");

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

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set'
    return `KSH ${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green'
      case 'reserved': return 'yellow'
      case 'sold': return 'red'
      default: return 'gray'
    }
  }

  return (

    <Box key={listing.id} onClick={() => handleListingClick(listing.id)} cursor="pointer">
      {/* Main Photo */}
      {listing.photos && listing.photos.length > 0 && (
        <Box position="relative" overflow="hidden" borderRadius="lg">
          <Image
            src={listing.photos[0]}
            alt={listing.title}
            objectFit="cover"
            w="full"
            mb={4}
            aspectRatio="1/1"
            fallback={<Skeleton width="full" aspectRatio="1/1" />}
            loading="lazy"
          />

          <HStack position="absolute" top={2} right={2} spacing={2}>
            <Badge colorScheme={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
          </HStack>
        </Box>
      )}
      {/* <Box mt="2">
        <Text fontSize="sm" noOfLines={{ base: 2, md: 1 }}>{listing.title}</Text>
        <Text fontSize="sm" fontWeight="semibold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES',
          }).format(listing.price)}
        </Text>
      </Box> */}

      <VStack spacing="1" align="stretch">

        <Text fontSize="sm" noOfLines={1}>
          {getTitle()}
        </Text>


        {listing.type === 'single_pet' && <Text fontSize="xs" color={textColor} noOfLines={2}>
          {listing.pet_gender} • {listing.pet_age} old
        </Text>}

        {listing.type === 'litter' && <Text fontSize="xs" color={textColor} noOfLines={2}>
          {listing.number_of_puppies} puppies • {getAge()} months old
        </Text>}

        {/* {listing.location_text && (
          <HStack align="center" spacing={1} mb={2}>
            <Icon as={MdLocationOn} boxSize={4} color="gray.500" />
            <Text fontSize="xs" color="gray.500">
              {listing.location_text}
            </Text>
          </HStack>
        )} */}


        {/* <Text fontSize="xs" color="gray.600" noOfLines={2}>
          {listing.description}
        </Text> */}

        <PriceTag price={listing.price} salePrice={listing.sale_price} currency={listing.currency} />



        {/* <Text fontSize="xs" color="gray.500">
          👁️ {listing.view_count || 0} views
        </Text> */}
      </VStack>
    </Box>
  )
}

export default ListingCard
