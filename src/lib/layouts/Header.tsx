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
import * as React from "react";
import { FiHelpCircle, FiBell } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";

// import { useUser } from "../hooks/useUser";
// import { APP_ROUTES } from "../utils/constants";

import { Logo } from "../components/Logo";
import { Sidebar } from "../components/nav/Sidebar";
import { ToggleButton } from "../components/nav/ToggleButton";
// import { UserProfile } from "../components/nav/UserProfile";

const Header = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });
  const { isOpen, onToggle, onClose } = useDisclosure();
  // const { user, authenticated } = useUser();
  // const navigate = useNavigate();
  const router = useRouter();
  const { pathname } = router;

  // const onLogin = () => {
  //   navigate(APP_ROUTES.LOG_IN);
  // };

  // const onSignup = () => {
  //   navigate(APP_ROUTES.SIGN_UP);
  // };

  // const { pathname } = useLocation();
  // const user, authenticated;

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
                  as="a"
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

              {/* <UserProfile user={user} isDesktop={isDesktop} /> */}

              <HStack spacing="3">
                <Button
                  variant="secondary-on-accent"
                  rounded="full"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </Button>
                <Button
                  variant="primary-on-accent"
                  rounded="full"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </Button>
              </HStack>
            </HStack>
          ) : (
            <>
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
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
