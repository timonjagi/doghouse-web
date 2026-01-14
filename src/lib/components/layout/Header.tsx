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
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHelpCircle, FiBell, FiMenu, FiMoon, FiSun } from "react-icons/fi";

import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";

import UserProfileMenu from "lib/components/auth/UserProfileMenu";
import { useCurrentUser } from "lib/hooks/queries";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { SearchInput } from "./SearchInput";

import { ToggleButton } from "./ToggleButton";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDesktop = useBreakpointValue({
    base: false,
    md: true,
  });
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const { pathname } = router;

  const { data: user } = useCurrentUser();

  return (
    <Box
      as="nav"
      bg="bg-accent"
      color="on-accent"
      zIndex={3}
      position="sticky"
      top="0"
    >
      <Container>
        <Flex justify="space-between" py={{ base: 2, md: 3 }} align="center">
          <Logo color="on-accent" />

          {isDesktop ? (
            <HStack spacing="4">
              <ButtonGroup variant="ghost-on-accent" spacing="1">
                <Button rounded="full" as={Link} href="/">
                  Home
                </Button>

                <Button
                  rounded="full"
                  as={Link}
                  aria-current={pathname.includes("about") ? "page" : false}
                  href="/about"
                >
                  About
                </Button>
                <Button
                  rounded="full"
                  as={Link}
                  aria-current={pathname.includes("explore") ? "page" : false}
                  href="/explore"
                >
                  Explore
                </Button>

                <Button
                  rounded="full"
                  as={Link}
                  aria-current={pathname.includes("blog") ? "page" : false}
                  href="/blog"
                >
                  Blog
                </Button>

                <Button
                  rounded="full"
                  as={Link}
                  aria-current={pathname.includes("partners") ? "page" : false}
                  href="/partners"
                >
                  Partners
                </Button>

                <Button
                  rounded="full"
                  as={Link}
                  aria-current={pathname.includes("contact") ? "page" : false}
                  href="/contact"
                >
                  Contact
                </Button>
                <IconButton
                  icon={<FiHelpCircle fontSize="1.25rem" />}
                  aria-label="FAQs"
                  onClick={() => router.push("/faqs")}
                />
              </ButtonGroup>

              <ButtonGroup variant="ghost-on-accent" spacing="1">
                <IconButton
                  icon={
                    colorMode === "light" ? (
                      <MdDarkMode fontSize="1.25rem" />
                    ) : (
                      <MdLightMode fontSize="1.25rem" />
                    )
                  }
                  aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"
                    } mode`}
                  onClick={toggleColorMode}
                />
                {/* {user && (
                  <IconButton
                    fontSize="1.25rem"
                    aria-label="Notifications"
                    icon={<FiBell />}
                  />
                )} */}

                {user ? (
                  <UserProfileMenu
                    name={user?.user_metadata?.name || user?.email || ""}
                    image={user?.user_metadata?.avatar_url || ""}
                    email={user?.email || ""}
                  />
                ) : (
                  <HStack spacing="3">
                    <Button
                      variant="secondary-on-accent"
                      rounded="full"
                      borderColor="white"
                      onClick={() => router.push("/login")}
                    >
                      Sign in
                    </Button>
                  </HStack>
                )}
              </ButtonGroup>
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

              <ButtonGroup
                variant="ghost-on-accent"
                spacing="2"
                alignItems="center"
              >

                <IconButton
                  icon={<FiHelpCircle fontSize="1.25rem" />}
                  aria-label="FAQs"
                  onClick={() => router.push("/faqs")}
                />

                <IconButton
                  icon={
                    colorMode === "light" ? (
                      <FiMoon fontSize="1.25rem" />
                    ) : (
                      <FiSun fontSize="1.25rem" />
                    )
                  }
                  aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"
                    } mode`}
                  onClick={toggleColorMode}
                  colorScheme="brand-on-accent"
                  variant="ghost-on-accent"
                />


                <ToggleButton
                  isOpen={isOpen}
                  aria-label="Open Menu"
                  onClick={onToggle}
                />
              </ButtonGroup>
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
    </Box >
  );
};

export default Header;
