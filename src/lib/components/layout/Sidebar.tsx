import {
  Divider,
  Flex,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
  Box,
  Button,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiBook,
  FiFacebook,
  FiHelpCircle,
  FiHome,
  FiInfo,
  FiInstagram,
  FiMessageSquare,
  FiSettings,
  FiTwitter,
} from "react-icons/fi";
import { Logo } from "./Logo";
import { NavButton } from "./NavButton";
import { useRouter } from "next/router";

import { NavSection, getNavigationForRole } from "lib/components/layout/navLinks";
import { UserProfile } from "../auth/UserProfile";
import { User } from "../../../../db/schema";
import { BsTiktok } from "react-icons/bs";
import { useCurrentUser } from "lib/hooks/queries";
import { useEffect } from "react";

interface SidebarProps {
  onClose: () => void;
  profile: User;
  loading?: boolean;
  navigationSections?: NavSection[];
}

export const Sidebar: React.FC<SidebarProps> = ({ profile, loading, onClose }) => {
  const { data: user, isLoading: loadingCurrentUser } = useCurrentUser();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Show loading state while checking auth
  if (loadingCurrentUser) {
    return (
      <Flex
        flex="1"
        bg="bg-accent"
        color="on-accent"
        maxW={{ base: "full", sm: "xs" }}
        justify="center"
        align="center"
        width="full"
        h={{ base: "calc(100vh - 64px)", md: "full" }}
        as="nav"
        direction="column"
      >
        <Logo />
      </Flex>
    );
  }

  return (
    <Flex
      flex="1"
      bg="bg-accent"
      color="on-accent"
      maxW={{ base: "full", sm: "xs" }}
      justify="space-between"
      width="full"
      h={{ base: "calc(100vh - 64px)", md: "full" }}
      as="nav"
      direction="column"
      overflowY="auto"
    >
      {user?.id ? (
        <LoggedInSidebar profile={profile} onClose={onClose} />
      ) : (
        <LoggedOutSidebar onClose={onClose} />
      )}
    </Flex>
  );
};

// Logged In Sidebar Component
interface LoggedInSidebarProps {
  profile: User;
  onClose: () => void;
}

const LoggedInSidebar: React.FC<LoggedInSidebarProps> = ({ profile, onClose }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [navigationSections, setNavigationSections] = React.useState<NavSection[]>([]);

  useEffect(() => {
    if (profile?.role) {
      const navigationSections = getNavigationForRole(profile.role as any);
      setNavigationSections(navigationSections);
    }

  }, [profile]);
  const onClickMenuLink = (link: string) => {
    router.push(link);
    if (isMobile) onClose();
  };

  return (
    <>
      <Stack
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Logo />

        <Stack>
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
      </Stack>

      {/* Account Section */}
      <Stack
        spacing="4"
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Divider borderColor="bg-accent-subtle" />

        <Stack>
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
    </>
  );
};

// Logged Out Sidebar Component
interface LoggedOutSidebarProps {
  onClose: () => void;
}

const LoggedOutSidebar: React.FC<LoggedOutSidebarProps> = ({ onClose }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const onClickMenuLink = (link: string) => {
    router.push(link);
    if (isMobile) onClose();
  };

  const onClickExternalLink = (link: string) => {
    window.open(link, '_blank');
    if (isMobile) onClose();
  };

  return (
    <>
      <Stack
        py={{ base: "6", sm: "8" }}
        px={{ base: "4", sm: "6" }}
      >
        <Logo />

        <Stack spacing="3">
          <NavButton
            label="Home"
            icon={FiHome}
            onClick={() => onClickMenuLink("/")}
          />
          <NavButton
            label="About"
            icon={FiInfo}
            onClick={() => onClickMenuLink("/about")}
            aria-current={
              router.pathname.includes("about") ? "page" : "false"
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

        <Stack spacing="3">
          <Text fontSize="sm" color="on-accent-muted" fontWeight="medium">
            Socials
          </Text>
          <Stack spacing="3">
            <NavButton
              label="Facebook"
              icon={FiFacebook}
              isExternal
              href="https://www.facebook.com/profile.php?id=100012765483528"
              onClick={() => onClickExternalLink("https://www.facebook.com/profile.php?id=100012765483528")}
            />
            <NavButton
              label="Twitter"
              icon={FiTwitter}
              isExternal
              href="https://twitter.com/doghousekenya"
              onClick={() => onClickExternalLink("https://twitter.com/doghousekenya")}
            />
            <NavButton
              label="Instagram"
              icon={FiInstagram}
              isExternal
              href="https://instagram.com/doghousekenya"
              onClick={() => onClickExternalLink("https://instagram.com/doghousekenya")}
            />
            <NavButton
              label="Tiktok"
              icon={BsTiktok}
              isExternal
              href="https://tiktok.com/@doghousekenya"
              onClick={() => onClickExternalLink("https://tiktok.com/@doghousekenya")}
            />
          </Stack>
        </Stack>
      </Stack>

      <Box borderTopWidth="1px">
        <NavButton2 href="/login" colorScheme="on-accent">Log in</NavButton2>
      </Box>
    </>
  );
};

const NavButton2 = (props) => (
  <Button
    as="a"
    width="full"
    borderRadius="0"
    variant="ghost-on-accent"
    size="lg"
    fontSize="sm"
    _hover={{
      bg: mode('brand.100', 'brand.700'),
    }}
    _active={{
      bg: mode('brand.200', 'brand.600'),
    }}
    _focus={{
      boxShadow: 'none',
    }}
    _focusVisible={{
      boxShadow: 'outline',
    }}
    {...props}
  />
)
