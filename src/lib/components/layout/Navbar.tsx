import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

import { FiBell } from "react-icons/fi";
import { useRouter } from "next/router";
import { useUserProfile } from "lib/hooks/queries/useUserProfile";

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const currentRoute = router.pathname;
  return (
    <>
      {isMobile && <Box width="full" px={{ base: "4", md: "8" }} py="4" bg="bg-accent">
        <Flex justify="space-between">
          <Logo />

          <HStack spacing="4">
            <ButtonGroup variant="ghost-on-accent" spacing="1">

              <ToggleButton
                isOpen={isOpen}
                aria-label="Open Menu"
                onClick={onToggle}
              />
            </ButtonGroup>
          </HStack>


        </Flex>
      </Box>
      }

      {!isMobile && <HStack justify="space-between" align="start">
        <Heading pb="4" size={{ base: "xs", lg: "md" }}>
          {currentRoute === "/dashboard" ? <span>Hi, {profile?.display_name} 👋</span>
            : <span>{router.pathname.split("/")[2]}</span>}
        </Heading>

        <HStack spacing="1" flex="1">
          <Spacer />
          <IconButton
            icon={<FiBell />}
            aria-label="Notifications"
            aria-current={
              router.pathname.includes("account/notifications") ? "page" : "false"
            }
            onClick={onToggle}
          />


        </HStack>
      </HStack>}

      <Drawer
        isOpen={isOpen}
        placement={isMobile ? "left" : "right"}
        onClose={onClose}
        isFullHeight
        preserveScrollBarGap
        // Only disabled for showcase
        trapFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          {isMobile && <Sidebar onClose={onClose} />}
        </DrawerContent>
      </Drawer>
    </>)

};
