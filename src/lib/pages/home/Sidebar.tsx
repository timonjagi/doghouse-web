import { Flex, Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import {
  FiBarChart2,
  FiCamera,
  FiCheckSquare,
  FiClock,
  FiFilm,
  FiGitlab,
  FiHome,
  FiInstagram,
  FiLinkedin,
  FiMessageSquare,
  FiMic,
  FiMusic,
  FiSettings,
  FiTwitter,
  FiUser,
} from "react-icons/fi";
import { Logo } from "../../components/nav/Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";

export const Sidebar = () => {
  const router = useRouter();

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
              aria-current={
                router.pathname.includes("dashboard") ? "page" : "false"
              }
            />
            <NavButton label="Inbox" icon={FiMessageSquare} />
          </Stack>
          <Stack>
            <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
              My Services
            </Text>
            <Stack spacing="1">
              <NavButton label="Scheduled" icon={FiClock} />
              <NavButton label="Completed" icon={FiCheckSquare} />
            </Stack>
          </Stack>
          <Stack>
            <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
              Account
            </Text>
            <Stack spacing="1">
              <NavButton label="Profile" icon={FiUser} />
              <NavButton label="Pets" icon={FiGitlab} />
              <NavButton label="Settings" icon={FiSettings} />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
};
