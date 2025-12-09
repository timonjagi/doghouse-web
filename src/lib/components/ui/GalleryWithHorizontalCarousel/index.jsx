import { Box } from '@chakra-ui/react'
import * as React from 'react'
import { Gallery } from './Gallery'

export const GalleryWithHorizontalCarousel = ({ images }) => {
  return (
    <Gallery images={images} />
  )
}
