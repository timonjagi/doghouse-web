import { Box, Image, Link, Skeleton, Spacer, Text } from '@chakra-ui/react'
import * as React from 'react'

export const NavProductItem = (props) => {
  const { imageUrl, name, price, currency, href } = props
  return (
    <Box as={Link} href={href} width="full" flex="1">
      <Image
        fit="cover"
        width="full"
        src={imageUrl}
        alt={name}
        height={{
          base: '7.5rem',
          lg: '12.5rem',
        }}
        fallback={<Skeleton width="full" height={{
          base: '7.5rem',
          lg: '12.5rem',
        }} />}
        rounded="lg"
      />
      <Box mt="2" flex="1">
        <Text fontSize="sm" noOfLines={1}>{name}</Text>

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
