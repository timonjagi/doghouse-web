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
  FiBook,
  FiCheckSquare,
  FiClock,
  FiCreditCard,
  FiFacebook,
  FiGitlab,
  FiHome,
  FiInfo,
  FiInstagram,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Logo } from "./Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";

import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { UserRole, NavSection } from "lib/config/navLinks";

interface SidebarProps {
  onClose: () => void;
  role?: UserRole | null;
  navigationSections?: NavSection[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, role, navigationSections = [] }) => {
  const { user, loading } = useSupabaseAuth();
  const { signOut } = useSupabaseAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const onClickMenuLink = (link: string) => {
    router.push(link);
    if (isMobile) onClose();
  };

  const onLogout = () => {
    signOut();
    if (!loading) router.push("/login");
    onClose();
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


          {user ? (
            <Stack flex="1">
              {/* Render dynamic navigation sections */}
              {navigationSections.map((section) => (
                <Stack key={section.title} spacing="1">
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

              <Spacer />

              {/* Common Account Section for all roles */}
              <Stack>
                <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
                  ACCOUNT
                </Text>
                <Stack spacing="1">
                  <NavButton
                    label="Profile"
                    icon={FiUser}
                    aria-current={
                      router.pathname.includes("/profile") ? "page" : "false"
                    }
                    onClick={() => onClickMenuLink("/dashboard/profile")}
                  />
                  <NavButton
                    label="Settings"
                    icon={FiSettings}
                    onClick={() => onClickMenuLink("/dashboard/settings")}
                    aria-current={
                      router.pathname.includes("/settings") ? "page" : "false"
                    }
                  />
                  <NavButton label="Logout" icon={FiLogOut} onClick={onLogout} />
                </Stack>
              </Stack>
            </Stack>
          )
            :
            <>
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
            </>
          }
        </Stack>
      </Stack>
    </Flex>
  );
};

const signedOutView = () => {

}
