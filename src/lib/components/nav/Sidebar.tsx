import {
  Flex,
  Text,
  Stack,
  Box,
  Button,
  Divider,
  HStack,
  Progress,
  Spacer,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiHome, FiHelpCircle, FiSettings, FiLogIn } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";

import { Logo } from "../Logo";
import { auth } from "lib/firebase/client";

import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();
  const { pathname } = router;
  const [user] = useAuthState(auth);

  const onClickNavButton = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <Flex as="section" minH="100vh" bg="bg-canvas">
      <Flex
        flex="1"
        bg="bg-accent"
        color="on-accent"
        maxW={{ base: "full", sm: "xs" }}
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Stack justify="space-between" spacing="1" width="full" height="full">
          <Flex direction="column" height="full">
            <Logo />
            <Stack spacing="1" mt="8" mb="8">
              <NavButton
                label="Home"
                icon={FiHome}
                aria-current={pathname === "/" ? "page" : false}
                onClick={() => onClickNavButton("/")}
              />
              <NavButton
                label="Dashboard"
                icon={RxDashboard}
                aria-current={pathname === "/dashboard" ? "page" : false}
                onClick={() => onClickNavButton("/dashboard")}
              />
            </Stack>
            {/* <Stack>
              <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
                Media
              </Text>
              <Stack spacing="1">
                <NavButton label="Movies" icon={FiFilm} />
                <NavButton label="Pictures" icon={FiCamera} />
                <NavButton label="Music" icon={FiMusic} />
                <NavButton label="Podcasts" icon={FiMic} />
              </Stack>
            </Stack> */}
            {/* <Stack>
              <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
                Social
              </Text>
              <Stack spacing="1">
                <NavButton label="Facebook" icon={FiFacebook} />
                <NavButton label="Twitter" icon={FiTwitter} />
                <NavButton label="Instagram" icon={FiInstagram} />
              </Stack>
            </Stack> */}

            <Spacer />

            {user && (
              <Stack spacing={{ base: "5", sm: "6" }}>
                <Stack spacing="1">
                  <NavButton label="Help" icon={FiHelpCircle} />
                  <NavButton label="Settings" icon={FiSettings} />
                </Stack>
                <Box bg="bg-accent-subtle" px="4" py="5" borderRadius="lg">
                  <Stack spacing="4">
                    <Stack spacing="1">
                      <Text fontSize="sm" fontWeight="medium">
                        Almost there
                      </Text>
                      <Text fontSize="sm" color="on-accent-muted">
                        Fill in some more information about yourself.
                      </Text>
                    </Stack>
                    <Progress
                      value={80}
                      size="sm"
                      variant="on-accent"
                      aria-label="Profile Update Progress"
                    />
                    <HStack spacing="3">
                      <Button variant="link-on-accent" size="sm">
                        Update profile
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
                <Divider borderColor="bg-accent-subtle" />
                <UserProfile
                  name={user?.displayName || ""}
                  image={user?.photoURL || ""}
                  phoneNumber={user?.phoneNumber || ""}
                  onClose={onClose}
                />
              </Stack>
            )}

            {!user && (
              <Box borderTopWidth="1px">
                <Button
                  width="full"
                  borderRadius="0"
                  variant="ghost-on-accent"
                  size="lg"
                  fontSize="sm"
                  _hover={{ bg: mode("brand.100", "brand.700") }}
                  _active={{ bg: mode("brand.200", "brand.600") }}
                  _focus={{ boxShadow: "none" }}
                  _focusVisible={{ boxShadow: "outline" }}
                  onClick={() => router.push("/login")}
                  rightIcon={<FiLogIn />}
                >
                  Log In
                </Button>
              </Box>
            )}
          </Flex>
        </Stack>
      </Flex>
    </Flex>
  );
};
