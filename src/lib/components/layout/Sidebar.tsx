import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Progress,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiBook,
  FiFacebook,
  FiGitlab,
  FiHelpCircle,
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

import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { NavSection, getNavigationForRole } from "lib/components/layout/navLinks";
import { UserProfile } from "../auth/UserProfile";
import { User } from "../../../../db/schema";

interface SidebarProps {
  onClose: () => void;
  profile: User
  navigationSections?: NavSection[];
}

export const Sidebar: React.FC<SidebarProps> = ({ profile, onClose }) => {
  const { user, loading } = useSupabaseAuth();
  const { signOut } = useSupabaseAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const navigationSections = getNavigationForRole(profile?.role as any);

  const onClickMenuLink = (link: string) => {
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
        <Stack spacing="4" shouldWrapChildren h="full">
          <Logo />

          {!loading && user && (
            <Stack flex="1" spacing="4">
              {/* Render dynamic navigation sections */}
              {navigationSections.map((section) => (
                <Stack key={section.title} spacing="2">
                  <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
                    {section.title}
                  </Text>
                  <Stack spacing="1">
                    {section.items.map((item) => (
                      <NavButton
                        key={item.href}
                        label={item.label}
                        icon={item.icon}
                        onClick={() => onClickMenuLink(item.href)}
                        aria-current={
                          router.pathname === item.href ? "page" : "false"
                        }
                      />
                    ))}
                  </Stack>
                </Stack>
              ))}


            </Stack>
          )}

          {!loading && !user && <>
            <Stack spacing="1">
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
                aria-current={router.pathname.includes("blog") ? "page" : "false"}
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
                <NavButton label="Facebook" icon={FiFacebook} />
                <NavButton label="Instagram" icon={FiInstagram} />
              </Stack>
            </Stack>
          </>}
        </Stack>

        {/* Common Account Section for all roles */}
        {!loading && user && (<Stack spacing="4">

          <Divider borderColor="bg-accent-subtle" />

          <Stack spacing="1">
            <NavButton
              label="Help Center"
              icon={FiHelpCircle}
              aria-current={
                router.pathname.includes("/help-center") ? "page" : "false"
              }
              onClick={() => onClickMenuLink("/dashboard/help-center")}
            />
            <NavButton
              label="Settings"
              icon={FiSettings}
              onClick={() => onClickMenuLink("/dashboard/settings")}
              aria-current={
                router.pathname.includes("/settings") ? "page" : "false"
              }
            />

          </Stack>


          <Divider borderColor="bg-accent-subtle" />
          <UserProfile profile={profile} onClose={onClose} />
        </Stack>
        )}
      </Stack>
    </Flex>
  );
};
