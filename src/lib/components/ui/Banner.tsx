import {
  Box,
  Button,
  CloseButton,
  Container,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'
import * as React from 'react'
import { FiInfo } from 'react-icons/fi'

interface BannerProps {
  title: string
  description: string
  button: {
    label: string
    link: string
  }
  onClose: () => void
}
export const Banner: React.FC<BannerProps> = ({
  title,
  description,
  button: { label, link },
  onClose,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  return (
    <Container as="section" pt={{ base: '4', md: '8' }} pb={{ base: '12', md: '24' }}>
      <Box
        bg="bg-surface"
        px={{ base: '4', md: '3' }}
        py={{ base: '4', md: '2.5' }}
        position="relative"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
        borderRadius="xl"
      >
        <CloseButton display={{ sm: 'none' }} position="absolute" right="2" top="2" />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          spacing={{ base: '3', md: '2' }}
          pb="0.5"
        >
          <Stack
            spacing="4"
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'start', md: 'center' }}
          >
            {!isMobile && (
              <Square size="12" bg="bg-subtle" borderRadius="md">
                <Icon as={FiInfo} boxSize="6" color="subtle" />
              </Square>
            )}
            <Stack
              spacing={{ base: '0.5', md: '0.5' }}
              pe={{ base: '4', sm: '0' }}
            >
              <Text fontWeight="medium">{title}</Text>
              <Text color="muted" fontSize="sm">{description}</Text>
            </Stack>
          </Stack>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: '3', sm: '2' }}
            align={{ base: 'stretch', sm: 'center' }}
          >
            <Button variant="primary" width="full" as={Link} href={link}>
              {label}
            </Button>
            <CloseButton display={{ base: 'none', sm: 'inline-flex' }} onClick={onClose} />
          </Stack>
        </Stack>
      </Box>
    </Container>
  )
}
