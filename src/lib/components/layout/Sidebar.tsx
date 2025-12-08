import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Stack,
  Link,
  Text,
  useBreakpointValue,
  useColorModeValue as mode,
  Progress,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiHelpCircle, FiSettings, FiX } from "react-icons/fi";
import { ColumnHeader, ColumnIconButton } from "./Column";
import { Logo } from "./Logo";
import { NavSection, getNavigationForRole } from "./navLinks";
import { User } from "../../db/schema";
import { useUserProfileById } from "lib/hooks/queries/useUserProfile";
import { useCurrentUser } from "lib/hooks/queries";
import { UserProfile } from "./UserProfile";
import NextLink from "next/link";

// Logged out navigation links
const LOGGED_OUT_NAV = {
  main: [
    { label: "Home", href: "/", icon: null },
    { label: "Breeds", href: "/breeds", icon: null },
    { label: "Breeders", href: "/breeders", icon: null },
    { label: "Blog", href: "/blog", icon: null },
  ],
  sections: [
    {
      title: "Company",
      items: [
        { label: "About", href: "/about", isExternal: false },
        { label: "Contact", href: "/contact", isExternal: false },
      ],
    },
    {
      title: "Socials",
      items: [
        { label: "Facebook", href: "https://www.facebook.com/doghousekenya", isExternal: true },
        { label: "Twitter", href: "https://twitter.com/doghousekenya", isExternal: true },
        { label: "Instagram", href: "https://instagram.com/doghousekenya", isExternal: true },
        { label: "TikTok", href: "https://tiktok.com/@doghousekenya", isExternal: true },
      ],
    },
  ],
};

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useUserProfileById(user?.id as string);

  // Wait for auth check to complete before deciding which sidebar to show
  // This prevents the flash between logged-out and logged-in views
  const isAuthLoading = userLoading || (user && profileLoading);

  if (isAuthLoading) {
    return (
      <Flex as="nav" height="full" direction="column" justify="space-between">
        {/* Empty shell while loading - maintains layout stability */}
      </Flex>
    );
  }

  return (
    <Flex as="nav" height="full" direction="column" justify="space-between">
      {profile?.id ? (
        <LoggedInSidebar profile={profile} onClose={onClose} />
      ) : (
        <LoggedOutSidebar onClose={onClose} />
      )}
    </Flex>
  );
};


// ============================================
// NavLink Component (based on Navigation.jsx)
// ============================================
interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  icon?: any;
  isExternal?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const NavLink = ({ children, href, icon, isExternal, isActive, onClick }: NavLinkProps) => (
  <Link
    as={NextLink}
    href={href}
    onClick={onClick}
    px="2"
    py="1.5"
    borderRadius="md"
    _hover={{
      bg: mode("gray.100", "gray.700"),
    }}
    aria-current={isActive ? "page" : undefined}
    _activeLink={{
      bg: "brand.100",
      color: "brand.700",
    }}
  >
    <HStack justify="space-between">
      <HStack spacing="3">
        {icon && <Icon as={icon} />}
        <Text as="span" fontSize="sm" fontWeight="medium" lineHeight="1.25rem">
          {children}
        </Text>
      </HStack>
      {isExternal && (
        <Icon as={FiArrowUpRight} boxSize="4" color={mode("brand.600", "brand.400")} />
      )}
    </HStack>
  </Link>
);

// ============================================
// NavHeading Component
// ============================================
interface NavHeadingProps {
  children: React.ReactNode;
}

const NavHeading = ({ children }: NavHeadingProps) => (
  <Text
    as="h4"
    fontSize="xs"
    fontWeight="semibold"
    px="2"
    lineHeight="1.25"
    color={mode("gray.600", "gray.400")}
  >
    {children}
  </Text>
);

// ============================================
// NavButton Component (for Sign In button)
// ============================================
const NavButton = (props: any) => (
  <Button
    width="full"
    borderRadius="0"
    variant="ghost"
    size="lg"
    fontSize="sm"
    _hover={{
      bg: mode("brand.100", "brand.700"),
    }}
    _active={{
      bg: mode("brand.200", "brand.600"),
    }}
    _focus={{
      boxShadow: "none",
    }}
    _focusVisible={{
      boxShadow: "outline",
    }}
    {...props}
  />
);

// ============================================
// Logged In Sidebar
// ============================================
interface LoggedInSidebarProps {
  profile: User;
  onClose: () => void;
}

const LoggedInSidebar: React.FC<LoggedInSidebarProps> = ({ profile, onClose }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [navigationSections, setNavigationSections] = useState<NavSection[]>([]);

  useEffect(() => {
    if (profile?.role) {
      const sections = getNavigationForRole(profile.role as any);
      setNavigationSections(sections);
    }
  }, [profile]);

  const handleNavClick = (href: string) => {
    router.push(href);
    if (isMobile) onClose();
  };

  return (
    <>
      <Stack spacing="3">
        <ColumnHeader>
          <HStack spacing="3" justify="space-between" w="full">

            <Logo color="on-brand" />

            <ColumnIconButton
              onClick={onClose}
              aria-label="Close navigation"
              icon={<FiX />}
              display={{
                base: "inline-flex",
                lg: "none",
              }}
            />
          </HStack>
        </ColumnHeader>

        <Stack px="6" spacing="6">
          {navigationSections.map((section) => (
            <Stack key={section.title} spacing="3">
              {section.title && <NavHeading>{section.title}</NavHeading>}
              <Stack spacing="1">

                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    isActive={router.pathname === item.href}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </Stack>
            </Stack>
          ))}

          {/* Extra links */}
          <Stack spacing="3">
            <NavHeading>Support</NavHeading>
            <Stack spacing="1">
              <NavLink
                href="/help-center"
                icon={FiHelpCircle}
                isActive={router.pathname.includes("/help-center")}
                onClick={() => handleNavClick("/help-center")}
              >
                Help Center
              </NavLink>
              <NavLink
                href="/dashboard/account/settings"
                icon={FiSettings}
                isActive={router.pathname.includes("/settings")}
                onClick={() => handleNavClick("/dashboard/account/settings")}
              >
                Settings
              </NavLink>
            </Stack>
          </Stack>
        </Stack>


      </Stack>

      {/* User Profile at bottom */}
      <Box borderTopWidth="1px" p="3">
        <UserProfile profile={profile} onClose={onClose} />
      </Box>
    </>
  );
};

// ============================================
// Logged Out Sidebar
// ============================================
interface LoggedOutSidebarProps {
  onClose: () => void;
}

const LoggedOutSidebar: React.FC<LoggedOutSidebarProps> = ({ onClose }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const handleNavClick = (href: string) => {
    router.push(href);
    if (isMobile) onClose();
  };

  const handleExternalClick = (href: string) => {
    window.open(href, "_blank");
    if (isMobile) onClose();
  };

  return (
    <>
      <Stack spacing="3">
        <ColumnHeader>
          <HStack spacing="3">
            <ColumnIconButton
              onClick={onClose}
              aria-label="Close navigation"
              icon={<FiX />}
              display={{
                base: "inline-flex",
                lg: "none",
              }}
            />
            <Logo color="on-brand" />
          </HStack>
        </ColumnHeader>

        <Stack px="3" spacing="6">
          {/* Main navigation */}
          <Stack spacing="1">
            {LOGGED_OUT_NAV.main.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={router.pathname === item.href}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </NavLink>
            ))}
          </Stack>

          {/* Sections */}
          {LOGGED_OUT_NAV.sections.map((section) => (
            <Stack key={section.title} spacing="3">
              <NavHeading>{section.title}</NavHeading>
              <Stack spacing="1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    isExternal={item.isExternal}
                    isActive={router.pathname === item.href}
                    onClick={() =>
                      item.isExternal
                        ? handleExternalClick(item.href)
                        : handleNavClick(item.href)
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* Sign In button at bottom */}
      <Box borderTopWidth="1px">
        <NavButton as="a" href="/login">
          Sign In
        </NavButton>
      </Box>
    </>
  );
};
