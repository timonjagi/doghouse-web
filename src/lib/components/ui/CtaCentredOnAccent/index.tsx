import { Box, Button, Container, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import Link from 'next/link';
import * as React from 'react'

interface CtaCentredOnAccentProps {
  title: string;
  description: string;
  ctaText1: string;
  ctaLink1: string;
  ctaText2: string;
  ctaLink2: string;
}
export const CtaCentredOnAccent = ({ title, description, ctaText1, ctaLink1, ctaText2, ctaLink2 }: CtaCentredOnAccentProps) => (
  <Box as="section" bg="bg-accent" color="on-accent">
    <Container py={{ base: '16', md: '24' }} px="4">
      <Stack spacing={{ base: '8', md: '10' }}>
        <Stack spacing={{ base: '4', md: '5' }} align="center">
          <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>{title}</Heading>
          <Text color="on-accent-muteed" maxW="2xl" textAlign="center" fontSize="xl">
            {description}
          </Text>
        </Stack>
        <Stack spacing="3" direction={{ base: 'column', sm: 'row' }} justify="center">
          <Button variant="secondary-on-accent" size="lg" href={ctaLink1} as={Link} >
            {ctaText1}
          </Button>
          <Button variant="primary-on-accent" size="lg" href={ctaLink2} as={Link}>
            {ctaText2}
          </Button>
        </Stack>
      </Stack>
    </Container>
  </Box>
)
