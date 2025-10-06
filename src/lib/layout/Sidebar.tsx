import {
  Button,
  Divider,
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
  FiBook,
  FiCheckSquare,
  FiClock,
  FiFacebook,
  FiGitlab,
  FiHome,
  FiInfo,
  FiInstagram,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Logo } from "./Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";
// import { useSignOut } from "react-firebase-hooks/auth";
// import { auth } from "lib/firebase/client";

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
      <Stack justify="space-between" spacing="1" width="full" h="full7">
        <Stack spacing="8" shouldWrapChildren>
          <Logo />
          <Stack spacing="1">
            {/* <NavButton
              label="Home"
              icon={FiHome}
              onClick={() => onClickMenuLink("/")}
              aria-current={router.pathname.includes("") ? "page" : "false"}
            /> */}
            <NavButton
              label="About"
              icon={FiInfo}
              onClick={() => onClickMenuLink("/about")}
              aria-current={
                router.pathname.includes("about") ? "page" : "false"
              }
            />
            <NavButton
              label="Breeds"
              icon={FiGitlab}
              onClick={() => onClickMenuLink("/breeds")}
              aria-current={
                router.pathname.includes("breeds") ? "page" : "false"
              }
            />
            <NavButton
              label="Blog"
              icon={FiBook}
              onClick={() => onClickMenuLink("/blog")}
              aria-current={
                router.pathname.includes("blog") ? "page" : "false"
              }
            />
            <NavButton
              label="Contact"
              icon={FiMessageSquare}
              onClick={() => onClickMenuLink("/contact")}
              aria-current={
                router.pathname.includes("contact") ? "page" : "false"
              }
            />


          </Stack>
          <Stack>
            <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
              Socials
            </Text>
            <Stack spacing="1">
              <NavButton
                label="Facebook"
                icon={FiFacebook}

              />
              <NavButton label="Instagram" icon={FiInstagram} />
            </Stack>
          </Stack>
          {/* <Stack>
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
                aria-current={
                  router.pathname.includes("account/pets") ? "page" : "false"
                }
                onClick={() => onClickMenuLink("/account/pets")}
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
          </Stack> */}

          {/* <Stack>
            <NavButton label="Logout" icon={FiLogOut} />
          </Stack> */}
        </Stack>
      </Stack>
    </Flex>
  );
};