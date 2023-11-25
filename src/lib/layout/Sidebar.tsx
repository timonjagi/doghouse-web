import {
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue as mode,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiCheckSquare,
  FiClock,
  FiGitlab,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Logo } from "../components/nav/Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";

export const Sidebar = () => {
  const [signOut, loading, error] = useSignOut(auth);

  const router = useRouter();
  const onClickMenuLink = (link) => {
    router.push(link);
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
      <Stack justify="space-between" spacing="1" width="full" h="full7">
        <Stack spacing="8" shouldWrapChildren>
          <Logo />
          <Stack spacing="1">
            <NavButton
              label="Home"
              icon={FiHome}
              onClick={() => onClickMenuLink("/home")}
              aria-current={router.pathname.includes("home") ? "page" : "false"}
            />
            <NavButton label="Inbox" icon={FiMessageSquare} />
          </Stack>
          <Stack>
            <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
              Services
            </Text>
            <Stack spacing="1">
              <NavButton
                label="Scheduled"
                icon={FiClock}
                onClick={() => onClickMenuLink("/services")}
              />
              <NavButton label="Completed" icon={FiCheckSquare} />
            </Stack>
          </Stack>
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
                label="Pets"
                icon={FiGitlab}
                onClick={() => onClickMenuLink("/account/pets")}
              />
              <NavButton
                label="Settings"
                icon={FiSettings}
                onClick={() => onClickMenuLink("/account/settings")}
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
