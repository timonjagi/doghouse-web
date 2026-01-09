import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";

interface PageHeaderWithTwoButtonsProps {
  title: string;
  description: React.ReactNode;
  badge?: React.ReactNode;
  badges?: React.ReactNode[];
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
  flexDir?: { base: "column" | "row"; md: "column" | "row" };
  actions?: React.ReactNode;
}

export const PageHeaderWithTwoButtons = ({
  title,
  description,
  badge,
  badges,
  buttonPrimary,
  buttonSecondary,
  flexDir = { base: "column", md: "row" },
  actions,
}: PageHeaderWithTwoButtonsProps) => {
  // Handle backwards compatibility: if badges is provided, use it; otherwise use badge
  const displayBadges = badges || (badge ? [badge] : null);

  return (
    <Stack spacing="4" direction={flexDir} justify="space-between">
      <Stack spacing="1">
        <Heading
          size={useBreakpointValue({ base: "xs", md: "sm" })}
          fontWeight="medium"
        >
          {title}
        </Heading>

        <HStack spacing="2">
          {typeof description === "string" ? (
            <Text color="muted">{description}</Text>
          ) : (
            <Box color="muted">{description}</Box>
          )}

          {displayBadges &&
            displayBadges.map((badgeItem, index) => (
              <Box key={index}>{badgeItem}</Box>
            ))}
        </HStack>
      </Stack>
      <Stack direction="row" spacing="3">
        {actions}
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
        {buttonSecondary && (
          <Button
            key={buttonSecondary.label}
            variant={buttonSecondary.variant}
            onClick={buttonSecondary.onClick}
            leftIcon={buttonSecondary.icon}
            colorScheme={buttonSecondary.colorScheme}
            isLoading={buttonSecondary.isLoading}
            isDisabled={buttonSecondary.isDisabled}
          >
            {buttonSecondary.label}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
