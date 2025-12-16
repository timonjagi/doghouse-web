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

interface BannerButton {
  label: string
  link?: string
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  colorScheme?: string
  icon?: any
}

interface BannerProps {
  title: string
  description: string
  button?: { // Deprecated but kept for safety if there are other usages not found
    label: string
    link: string
  }
  buttons?: BannerButton[] // New multiple buttons support
  onClose?: () => void // Make optional
}

export const Banner: React.FC<BannerProps> = ({
  title,
  description,
  button,
  buttons = [],
  onClose,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Normalized buttons list
  const displayButtons = buttons.length > 0 ? buttons : button ? [{
    label: button.label,
    link: button.link,
    variant: 'solid'
  } as BannerButton] : [];

  return (
    <Container as="section" pt={{ base: '4', md: '4' }} pb={{ base: '4', md: '4' }}>
      <Box
        bg="bg-surface"
        px={{ base: '4', md: '3' }}
        py={{ base: '4', md: '2.5' }}
        position="relative"
        boxShadow={useColorModeValue('sm', 'sm-dark')}
        borderRadius="xl"
      >
        {onClose && <CloseButton display={{ sm: 'none' }} position="absolute" right="2" top="2" onClick={onClose} />}
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
            {displayButtons.map((btn, idx) => (
              <Button
                key={idx}
                variant={btn.variant || 'solid'} // Use default variant if not specified
                colorScheme={btn.colorScheme || 'brand'} // Default color scheme
                width={{ base: 'full', sm: 'auto' }}
                as={btn.link ? Link : 'button'}
                {...(btn.link ? { href: btn.link } : { onClick: btn.onClick })} // Use href if link is provided, otherwise use onClick
                leftIcon={btn.icon ? <Icon as={btn.icon} /> : undefined}
              >
                {btn.label}
              </Button>
            ))}
            {onClose && <CloseButton display={{ base: 'none', sm: 'inline-flex' }} onClick={onClose} />}
          </Stack>
        </Stack>
      </Box>
    </Container>
  )
}
