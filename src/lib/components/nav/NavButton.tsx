import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";
// import React from "react";
interface NavButtonProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
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
