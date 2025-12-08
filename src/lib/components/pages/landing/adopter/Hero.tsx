import {
  Box,
  Button,
  Circle,
  Heading,
  Img,
  LightMode,
  Stack,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react'
import * as React from 'react'
import { FaPlay } from 'react-icons/fa'

export const Hero = () => {
  return (
    <Box as="section" bg="brand.600" color="white" py="7.5rem" w="full">
      <Box maxW={{ base: 'xl', md: '5xl' }} mx="auto" px={{ base: '6', md: '8' }}>
        <Box textAlign="center">
          <Heading
            as="h1"
            size="3xl"
            fontWeight="bold"
            maxW="48rem"
            mx="auto"
            lineHeight="1.2"
            letterSpacing="tight"
          >
            Find Your Perfect Furry Friend
          </Heading>
          <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
            Discover your ideal furry companion and start a journey of love and
            companionship.
          </Text>
        </Box>

        <Stack
          justify="center"
          direction={{ base: 'column', md: 'row' }}
          mt="10"
          mb="20"
          spacing="4"
        >
          <LightMode>
            <Button
              as="a"
              href="/signup"
              size="lg"
              colorScheme="brand"
              px="8"
              fontWeight="bold"
              fontSize="md"
            >
              Get started
            </Button>
            <Button
              as="a"
              href="/features"
              size="lg"
              colorScheme="brand-on-accent"
              px="8"
              fontWeight="bold"
              fontSize="md"
            >
              Learn more
            </Button>
          </LightMode>
        </Stack>

        <Box
          className="group"
          cursor="pointer"
          position="relative"
          rounded="lg"
          overflow="hidden"
        >
          <Img
            alt="Screenshot of Doghouse App"
            src="/images/screenshot.png"

          />
          <Circle
            size="20"
            as="button"
            bg="white"
            shadow="lg"
            color="brand.600"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate3d(-50%, -50%, 0)"
            fontSize="xl"
            transition="all 0.2s"
            _groupHover={{
              transform: 'translate3d(-50%, -50%, 0) scale(1.05)',
            }}
          >
            <VisuallyHidden>Play demo video</VisuallyHidden>
            <FaPlay />
          </Circle>
        </Box>
      </Box>
    </Box>
  )
}
