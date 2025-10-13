import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";
// import { useSignOut } from "react-firebase-hooks/auth";
// import { auth } from "lib/firebase/client";
import { FiBell } from "react-icons/fi";

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box width="full" px={{ base: "4", md: "8" }} py="4" bg="bg-accent">
      <Flex justify="space-between">
        <Logo />

        <HStack spacing="4">
          <ButtonGroup variant="ghost-on-accent" spacing="1">
            <IconButton
              fontSize="1.25rem"
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost-on-accent"
            />

            <ToggleButton
              isOpen={isOpen}
              aria-label="Open Menu"
              onClick={onToggle}
            />
          </ButtonGroup>
        </HStack>

        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          isFullHeight
          preserveScrollBarGap
          // Only disabled for showcase
          trapFocus={false}
        >
          <DrawerOverlay />
          <DrawerContent>
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};
