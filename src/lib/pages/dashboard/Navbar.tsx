import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "../../components/nav/Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  return (
    <Box width="full" px={{ base: "4", md: "8" }} py="4" bg="bg-accent">
      <Flex justify="space-between">
        <Logo />
        <ToggleButton
          isOpen={isOpen}
          aria-label="Open Menu"
          onClick={onToggle}
        />
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
            <Sidebar />
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};
