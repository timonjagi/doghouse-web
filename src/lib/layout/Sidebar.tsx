import {
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiCheckSquare,
  FiClock,
  FiGitlab,
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Logo } from "../components/nav/Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";
import Link from "next/link";

export const Sidebar = () => {
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
      py={{ base: "6", sm: "8" }}
      px={{ base: "4", sm: "6" }}
    >
      <Stack justify="space-between" spacing="1" width="full">
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
              My Services
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
                  router.pathname.includes("account") ? "page" : "false"
                }
                onClick={() => onClickMenuLink("/account")}
              />
              <NavButton label="Pets" icon={FiGitlab} />
              <NavButton label="Settings" icon={FiSettings} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
};
