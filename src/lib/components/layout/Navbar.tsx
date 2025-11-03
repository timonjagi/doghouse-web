import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
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
import { NotificationsDrawer } from "./NotificationsDrawer";
import Link from "next/link";

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

      {!isMobile && (

        <HStack spacing="1" flex="1" p={8}>

          <Breadcrumb>
            {router.pathname.split("/").map((item, index) => (
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} href={`/${router.pathname.split("/").slice(1, index + 1).join("/")
                  }`}>{
                    router.pathname.split("/")[router.pathname.split("/").length - 1] === item && index !== 0
                      ? item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")
                      : item === "[id]" ? "Detail"
                        : item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " ")
                  }</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Spacer />
          <IconButton
            icon={<FiBell />}
            aria-label="Notifications"
            onClick={onToggle}
          />
        </HStack>
      )}

      {/* Mobile Drawer with Sidebar */}

      <Drawer
        isOpen={isOpen}
        placement={isMobile ? 'left' : 'right'}
        onClose={onClose}
        isFullHeight
        preserveScrollBarGap
        trapFocus={false}
        size={{ base: 'xs', md: 'sm' }}
      >
        <DrawerOverlay />
        <DrawerContent>
          {isMobile ? (
            <Sidebar onClose={onClose} profile={profile} loading={profileLoading} />
          ) :
            <NotificationsDrawer isOpen={isOpen} onClose={onClose} />
          }

        </DrawerContent>
      </Drawer>



    </>)

};
