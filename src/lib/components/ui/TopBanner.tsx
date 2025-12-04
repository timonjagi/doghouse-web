import { Box } from '@chakra-ui/react'
import React from 'react'

export const TopBanner = ({ label, ...props }) => {
  return (
    <Box
      bg="bg-accent"
      color="white"
      textAlign="center"
      py="2"
      fontSize="sm"
      fontWeight="medium"
      {...props}
    >
      {label}
    </Box>
  )
}
