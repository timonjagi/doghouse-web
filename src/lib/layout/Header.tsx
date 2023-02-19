import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  Center,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { FiHelpCircle, FiBell } from "react-icons/fi";

import { Logo } from "../components/Logo";
import { Sidebar } from "../components/nav/Sidebar";
import { ToggleButton } from "../components/nav/ToggleButton";
import { auth } from "lib/firebase/client";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Header = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const { pathname } = router;
  const toast = useToast();

  const [user] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);

  const onLogout = async () => {
    try {
      const success = await signOut();

      if (success) {
        toast({
          title: "Logged out successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        return await router.push("/");
      }
    } catch (err) {
      toast({
        title: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="nav" bg="bg-accent" color="on-accent">
      <Container
        py={{
          base: "3",
          lg: "4",
        }}
      >
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo />
            {isDesktop && (
              <ButtonGroup variant="ghost-on-accent" spacing="1">
                <Button
                  rounded="full"
                  onClick={() => router.push("/")}
                  aria-current={pathname === "/" ? "page" : false}
                >
                  Home
                </Button>
                <Button
                  rounded="full"
                  aria-current={pathname === "/dashboard" ? "page" : false}
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
                {/* <Button>Tasks</Button>
                <Button>Bookmarks</Button>
                <Button>Users</Button> */}
              </ButtonGroup>
            )}
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
                <IconButton
                  fontSize="1.25rem"
                  aria-label="Notifications"
                  icon={<FiBell />}
                />
              </ButtonGroup>

              {user ? (
                <Menu variant="primary-on-accent">
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                    color="on-accent"
                  >
                    <Avatar
                      name={user?.displayName || ""}
                      src={user?.photoURL || ""}
                      boxSize="10"
                    />
                  </MenuButton>
                  <MenuList alignItems="center" color="brand.400">
                    <br />
                    <Center>
                      <Avatar
                        name={user?.displayName || ""}
                        src={user?.photoURL || ""}
                        size="2xl"
                      />
                    </Center>
                    <br />
                    <Center>
                      <Box>
                        <Text
                          color="on-accent"
                          fontWeight="medium"
                          fontSize="sm"
                        >
                          {user?.displayName}
                        </Text>
                        <Text color="on-accent-muted" fontSize="sm">
                          {user?.phoneNumber}
                        </Text>
                      </Box>
                    </Center>
                    <MenuDivider />
                    {/* <MenuItem>Your Servers</MenuItem> */}
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing="3">
                  <Button
                    variant="secondary-on-accent"
                    rounded="full"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                </HStack>
              )}
            </HStack>
          ) : (
            <Flex align="center">
              <IconButton
                variant="ghost-on-accent"
                fontSize="1.25rem"
                aria-label="Notifications"
                icon={<FiBell />}
                mr={3}
              />
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
