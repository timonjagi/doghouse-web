import { EditIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons';
import { Card, HStack, IconButton, Menu, MenuButton, MenuList, MenuItem, CardBody, VStack, Box, Heading, Badge, Image, Text, MenuDivider, MenuGroup, useColorModeValue, Skeleton } from '@chakra-ui/react';
import React from 'react'
import { FaEllipsisV } from 'react-icons/fa';

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
        </Box>
      )}

      <VStack spacing={3} p={4} align="stretch">
        <Box>
          <Text size="lg" fontWeight='semibold' noOfLines={2} mb={2}>
            {listing.title}
          </Text>
          <HStack>
            <Badge colorScheme={listing.type === 'litter' ? 'blue' : 'green'}>
              {listing.type === 'litter' ? 'Litter' : 'Single Pet'}
            </Badge>
            <Badge colorScheme={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
          </HStack>
        </Box>

        <Text fontSize="xs" color="gray.600" noOfLines={2}>
          {listing.description}
        </Text>

        <Text fontSize="lg" fontWeight="semibold" color="brand.600">
          {formatPrice(listing.price)}
        </Text>

        {/* <Text fontSize="xs" color="gray.500">
          Created: {new Date(listing.created_at).toLocaleDateString()}
        </Text> */}

      </VStack>
    </Box>
  )
}

export default ManageListingCard