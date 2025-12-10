import { Box, Button, Container, Heading, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import * as React from 'react'

interface PageHeaderWithTwoButtonsProps {
  title: string;
  description: React.ReactNode;
  buttonPrimary?: {
    label: string;
    variant?: string;
    onClick: () => void;
    icon?: any;
    colorScheme?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
  };
  buttonSecondary?: {
    label: string;
    variant?: string;
    onClick: () => void;
    icon?: any;
    colorScheme?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
  };
  flexDir?: { base: "column" | "row", md: "column" | "row" };
}

export const PageHeaderWithTwoButtons = ({
  title,
  description,
  buttonPrimary,
  buttonSecondary,
  flexDir = { base: 'column', md: 'row' },
}: PageHeaderWithTwoButtonsProps) => (
  <Stack spacing="4" direction={flexDir} justify="space-between">
    <Stack spacing="1">
      <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })} fontWeight="medium">
        {title}
      </Heading>
      {typeof description === 'string' ? (
        <Text color="muted">{description}</Text>
      ) : (
        <Box color="muted">{description}</Box>
      )}
    </Stack>
    <Stack direction="row" spacing="3">
      {buttonPrimary && (
        <Button
          key={buttonPrimary.label}
          variant={buttonPrimary.variant}
          onClick={buttonPrimary.onClick}
          leftIcon={buttonPrimary.icon}
          colorScheme={buttonPrimary.colorScheme}
          isLoading={buttonPrimary.isLoading}
          isDisabled={buttonPrimary.isDisabled}
        >
          {buttonPrimary.label}
        </Button>
      )}
      {buttonSecondary && <Button
        key={buttonSecondary.label}
        variant={buttonSecondary.variant}
        onClick={buttonSecondary.onClick}
        leftIcon={buttonSecondary.icon}
        colorScheme={buttonSecondary.colorScheme}
        isLoading={buttonSecondary.isLoading}
        isDisabled={buttonSecondary.isDisabled}
      >
        {buttonSecondary.label}
      </Button>}
    </Stack>
  </Stack>
)
