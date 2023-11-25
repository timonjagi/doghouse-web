import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
// import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiHelpCircle, FiBell } from "react-icons/fi";

import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";
import UserProfileMenu from "lib/components/nav/UserProfileMenu";
import { auth } from "lib/firebase/client";

const Header = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    md: true,
  });
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  // const { pathname } = router;

  const [user] = useAuthState(auth);

  return (
    <Box
      as="nav"
      bg="bg-accent"
      color="on-accent"
      zIndex={3}
      position="sticky"
      top="0"
    >
      <Container
        py={{
          base: "3",
          lg: "4",
        }}
      >
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo />
            {/* {isDesktop && (
              <ButtonGroup variant="ghost-on-accent" spacing="1">
                {user && (
                  <Button
                    rounded="full"
                    as={Link}
                    aria-current={
                      pathname.includes("dashboard") ? "page" : false
                    }
                    href="/dashboard"
                  >
                    Dashboard
                  </Button>
                )}

                <Button
                  rounded="full"
                  as={Link}
                  aria-current={pathname.includes("breeds") ? "page" : false}
                  href="/breeds"
                >
                  Search Breeds
                </Button>
                <Button>Tasks</Button>
                <Button>Bookmarks</Button>
                <Button>Users</Button>
              </ButtonGroup>
            )} */}
          </HStack>
          {isDesktop ? (
            <HStack spacing="4">
              <ButtonGroup variant="ghost-on-accent" spacing="1">
                {/* <IconButton
                  icon={<FiSearch fontSize='1.25rem' />}
                  aria-label='Search'
                />
                <IconButton
                  icon={<FiSettings fontSize='1.25rem' />}
                  aria-label='Settings'
                /> */}
                <IconButton
                  icon={<FiHelpCircle fontSize="1.25rem" />}
                  aria-label="Help Center"
                />
                {/* {user && (
                  <IconButton
                    fontSize="1.25rem"
                    aria-label="Notifications"
                    icon={<FiBell />}
                  />
                )} */}
              </ButtonGroup>

              {user ? (
                <UserProfileMenu
                  name={user?.displayName || ""}
                  image={user?.photoURL || ""}
                  phoneNumber={user?.phoneNumber || ""}
                />
              ) : (
                <HStack spacing="3">
                  <Button
                    variant="secondary-on-accent"
                    rounded="full"
                    borderColor="white"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                </HStack>
              )}
            </HStack>
          ) : (
            <Flex align="center">
              {/* <IconButton
                variant="ghost-on-accent"
                fontSize="1.25rem"
                aria-label="Notifications"
                icon={<FiBell />}
                mr={3}
              /> */}
              {/* <ToggleButton
                isOpen={isOpen}
                aria-label="Open Menu"
                onClick={onToggle}
              /> */}
              {user ? (
                <UserProfileMenu
                  name={user?.displayName || ""}
                  image={user?.photoURL || ""}
                  phoneNumber={user?.phoneNumber || ""}
                />
              ) : (
                <HStack spacing="3">
                  <Button
                    variant="secondary-on-accent"
                    rounded="full"
                    borderColor="white"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                </HStack>
              )}

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
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
