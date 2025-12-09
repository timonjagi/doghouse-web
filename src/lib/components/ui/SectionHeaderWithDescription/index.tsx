import { Box, Container, Divider, Stack, Text } from '@chakra-ui/react'
import * as React from 'react'

interface SectionHeaderWithDescriptionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SectionHeaderWithDescription = ({ title, description, children }: SectionHeaderWithDescriptionProps) => (
  <Box as="section" bg="bg-surface"
    pt={{ base: '4', md: '8' }} pb={{ base: '12', md: '24' }}

  >
    <Container>
      <Stack spacing="2">
        <Box>
          <Text fontSize="lg" fontWeight="medium">
            {title}
          </Text>
          <Text color="muted" fontSize="sm">
            {description}
          </Text>
        </Box>
        <Divider />

        {children}
      </Stack>
    </Container>
  </Box>
)
