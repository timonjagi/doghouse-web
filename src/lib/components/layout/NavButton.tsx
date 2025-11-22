import type {
  ButtonProps,
} from "@chakra-ui/react";
import { Box, Button, HStack, Icon, Text, useColorModeValue as mode, } from "@chakra-ui/react";
import Link from "next/link";
import type { ElementType } from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface NavButtonProps extends ButtonProps {
  icon: ElementType;
  label: string;
  href?: string;
  as?: ElementType;
  isExternal?: boolean;
  endElement?: any;
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, endElement, ...buttonProps } = props;

  return (
    <Button variant="ghost-on-accent" justifyContent="start" {...buttonProps}>
      <HStack justify="space-between" w="full">
        <HStack spacing="3">
          <Icon as={icon} boxSize="6" color="on-accent-subtle" />
          <Text>{label}</Text>
        </HStack>
        {props.isExternal && (
          <Icon as={FiArrowUpRight} boxSize="4" color="on-accent-subtle" />
        )}
        {endElement && <Box>{endElement}</Box>}
      </HStack>
    </Button>
  );
};
