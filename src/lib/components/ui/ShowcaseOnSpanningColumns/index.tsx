import { Box, Stack } from '@chakra-ui/react'
import * as React from 'react'
import { ImageWithOverlay } from './ImageWithOverlay'

export const ShowcaseOnSpanningColumns = ({ data }: { data: any }) => (
  <Box
    maxW="7xl"
    mx="auto"

  >
    <Stack
      height={{ md: '540px' }}
      direction={{ base: 'column', md: 'row' }}
      spacing={{ base: '6', md: '10' }}
      align="stretch"
    >
      <ImageWithOverlay
        flex="1"
        objectPosition="top center"
        title={data[0].title}
        description={data[0].description}
        src={data[0].image}
        alt={data[0].alt}
        url={data[0].url}
        buttonText={data[0].buttonText}
        iconLeft={data[0].iconLeft}
      />

      <Stack spacing={{ base: '6', md: '10' }} maxW={{ md: '400px' }}>
        <ImageWithOverlay
          spacing="4"
          title={data[1].title}
          description={data[1].description}
          src={data[1].image}
          alt={data[1].alt}
          url={data[1].url}
          buttonText={data[1].buttonText}
          iconLeft={data[1].iconLeft}
        />
        <ImageWithOverlay
          spacing="4"
          title={data[2].title}
          description={data[2].description}
          src={data[2].image}
          alt={data[2].alt}
          url={data[2].url}
          buttonText={data[2].buttonText}
          iconLeft={data[2].iconLeft}
        />
      </Stack>
    </Stack>
  </Box>
)
