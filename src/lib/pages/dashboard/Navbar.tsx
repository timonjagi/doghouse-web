import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "../../components/nav/Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { MdLogout } from "react-icons/md";

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [signOut, loading, error] = useSignOut(auth);

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

            <DrawerFooter>
              <Button cursor="pointer" as="button" onClick={signOut}>
                Logout
                <Icon as={MdLogout} />
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};
