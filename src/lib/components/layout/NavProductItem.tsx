import { Box, Image, Link, Skeleton, Text } from '@chakra-ui/react'
import * as React from 'react'

export const NavProductItem = (props) => {
  const { imageUrl, name, price, currency, href } = props
  return (
    <Box as={Link} href={href} width="full">
      <Image
        fit="cover"
        width="full"
        src={imageUrl}
        alt={name}
        height={{
          base: '7.5rem',
          lg: '12.5rem',
        }}
        fallback={<Skeleton width="full" height="full" />}
        rounded="lg"
      />
      <Box mt="2">
        <Text fontSize="sm" noOfLines={{ base: 2, md: 1 }}>{name}</Text>
        <Text fontSize="sm" fontWeight="semibold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
          }).format(price)}
        </Text>
      </Box>
    </Box>
  )
}
