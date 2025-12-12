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
import Link from "next/link";
import { useRouter } from "next/router";
import { FiHelpCircle, FiBell, FiMenu } from "react-icons/fi";

import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";

import UserProfileMenu from "lib/components/auth/UserProfileMenu";
import { useCurrentUser } from "lib/hooks/queries";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { SearchInput } from "./SearchInput";

import { ToggleButton } from "./ToggleButton";

const Header = () => {
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
      <Container
        py={{
          base: "3",
          lg: "4",
        }}
      >
        <Flex justify="space-between">
          <HStack spacing="4">
            <Logo color="on-accent" />
            {isDesktop && <ButtonGroup variant="ghost-on-accent" spacing="1" />}
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
                <Button
                  rounded="full"
                  as={Link}
                  href="/"
                >
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
                  aria-current={pathname.includes("contact") ? "page" : false}
                  href="/contact"
                >
                  Contact
                </Button>
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
