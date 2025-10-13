import {
  Button,
  Flex,
  Spacer,
  Stack,
  Text,
  useColorModeValue as mode,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiCheckSquare,
  FiClock,
  FiCreditCard,
  FiGitlab,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Logo } from "./Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";
// import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";

export const Sidebar = ({ onClose }) => {
  // const [signOut, loading, error] = useSignOut(auth);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const onClickMenuLink = (link) => {
    router.push(link);
    if (isMobile) onClose();
  };
  return (
    <Flex
      flex="1"
      bg="bg-accent"
      color="on-accent"
      overflowY="auto"
      maxW={{ base: "full", sm: "xs" }}
      maxH="100vh"
      py={{ base: "6", sm: "8" }}
      px={{ base: "4", sm: "6" }}
    >
      <Stack justify="space-between" spacing="1" width="full" h="full">
        <Stack spacing="8" shouldWrapChildren h="full">
          <Logo />
          <Stack spacing="1">
            <NavButton
              label="Home"
              icon={FiHome}
              onClick={() => onClickMenuLink("/home")}
              aria-current={router.pathname.includes("home") ? "page" : "false"}
            />
            <NavButton
              label="Inbox"
              icon={FiMessageSquare}
              onClick={() => onClickMenuLink("/inbox")}
              aria-current={
                router.pathname.includes("inbox") ? "page" : "false"
              }
            />
          </Stack>
          <Stack>
            <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
              Breeds
            </Text>
            <Stack spacing="1">
              <NavButton
                label="Explore"
                icon={FiSearch}
                onClick={() => onClickMenuLink("/breeds")}
                aria-current={router.pathname === "/breeds" ? "page" : "false"}
              />
              <NavButton
                label="Manage"
                icon={FiCheckSquare}
                onClick={() => onClickMenuLink("/my-breeds")}
                aria-current={
                  router.pathname.includes("my-breeds") ? "page" : "false"
                }
              />
            </Stack>
          </Stack>

          <Spacer />

          <Stack>
            <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
              Account
            </Text>
            <Stack spacing="1">
              <NavButton
                label="Profile"
                icon={FiUser}
                aria-current={
                  router.pathname.includes("account/profile") ? "page" : "false"
                }
                onClick={() => onClickMenuLink("/account/profile")}
              />

              <NavButton
                label="Billing"
                icon={FiCreditCard}
                aria-current={
                  router.pathname.includes("account/billing") ? "page" : "false"
                }
                onClick={() => onClickMenuLink("/account/billing")}
              />
              <NavButton
                label="Settings"
                icon={FiSettings}
                onClick={() => onClickMenuLink("/account/settings")}
                aria-current={
                  router.pathname.includes("account/settings")
                    ? "page"
                    : "false"
                }
              />
            </Stack>
          </Stack>

          {/* <Stack>
            <NavButton label="Logout" icon={FiLogOut} />
          </Stack> */}
        </Stack>
      </Stack>
    </Flex>
  );
};
