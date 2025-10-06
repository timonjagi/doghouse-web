import type { ButtonProps } from "@chakra-ui/react";
import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";

interface NavButtonProps extends ButtonProps {
  icon: any;
  label: string;
  href?: string;
  as?: any;
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, ...buttonProps } = props;
  return (
    <Button variant="ghost-on-accent" justifyContent="start" {...buttonProps}>
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="on-accent-subtle" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  );
};
