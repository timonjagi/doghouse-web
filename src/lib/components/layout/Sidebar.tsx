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
import { FiArrowUpRight, FiBook, FiBriefcase, FiHelpCircle, FiHome, FiInfo, FiSearch, FiSettings, FiX } from "react-icons/fi";
import { ColumnHeader, ColumnIconButton } from "./Column";
import { Logo } from "./Logo";
import { NavButton } from "./NavButton";
import { NavSection, getNavigationForRole } from "./navLinks";
import { User } from "../../db/schema";
import { useUserProfileById } from "lib/hooks/queries/useUserProfile";
import { useCurrentUser } from "lib/hooks/queries";
import { UserProfile } from "./UserProfile";
import NextLink from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { BsTiktok } from "react-icons/bs";

// Logged out navigation links
const LOGGED_OUT_NAV = {
  main: [
    { label: "Home", href: "/", icon: FiHome },
    { label: 'Explore', href: '/explore', icon: FiSearch },
    {
      label: "Blog", href: "/blog", icon: FiBook

    },
  ],
  sections: [
    {
      title: "Company",
      items: [
        { label: "About", href: "/about", icon: FiBriefcase },
        { label: "Contact", href: "/contact", icon: FiInfo },
      ],
    },
    {
      title: "Socials",
      items: [
        { label: "Whatsapp", href: "https://wa.me/+254789949979", icon: FaWhatsapp, isExternal: true },
        { label: "Facebook", href: "https://www.facebook.com/doghousekenya", icon: FaFacebook, isExternal: true },
        { label: "Twitter", href: "https://twitter.com/doghousekenya", icon: FaTwitter, isExternal: true },
        { label: "Instagram", href: "https://instagram.com/doghousekenya", icon: FaInstagram, isExternal: true },
        { label: "TikTok", href: "https://tiktok.com/@doghousekenya", icon: BsTiktok, isExternal: true },
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
  variant?: "default" | "on-accent";
}

const NavHeading = ({ children, variant = "default" }: NavHeadingProps) => (
  <Text
    as="h4"
    fontSize="xs"
    fontWeight="semibold"
    px="2"
    lineHeight="1.25"
    color={variant === "on-accent" ? "on-accent-muted" : mode("gray.600", "gray.400")}
  >
    {children}
  </Text>
);

// ============================================
// SignInButton Component (for Sign In button)
// ============================================
const SignInButton = (props: any) => (
  <Button
    width="full"
    borderRadius="0"
    variant="ghost-on-accent"
    size="lg"
    fontSize="sm"
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
    <Flex
      flex="1"
      bg="bg-accent"
      color="on-accent"
      direction="column"
      justify="space-between"
      h="full"
    >
      <Stack spacing="8" py="6" px="4">
        <HStack spacing="3" justify="space-between" w="full">

          <Logo color="on-accent" />

          <ColumnIconButton
            onClick={onClose}
            aria-label="Close navigation"
            icon={<Icon as={FiX} boxSize="6" />}
            display={{
              base: "inline-flex",
              lg: "none",
            }}
            color="on-accent"
          />
        </HStack>

        {/* Main navigation */}
        <Stack spacing="1">
          {LOGGED_OUT_NAV.main.map((item) => (
            <NavButton
              key={item.href}
              label={item.label}
              icon={item.icon}
              aria-current={router.pathname === item.href ? "page" : undefined}
              onClick={() => handleNavClick(item.href)}
            />
          ))}
        </Stack>

        {/* Sections */}
        {LOGGED_OUT_NAV.sections.map((section) => (
          <Stack key={section.title} spacing="3">
            <NavHeading variant="on-accent">{section.title}</NavHeading>
            <Stack spacing="1">
              {section.items.map((item) => (
                <NavButton
                  key={item.href}
                  label={item.label}
                  icon={item.icon}
                  isExternal={item.isExternal}
                  aria-current={router.pathname === item.href ? "page" : undefined}
                  onClick={() =>
                    item.isExternal
                      ? handleExternalClick(item.href)
                      : handleNavClick(item.href)
                  }
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      {/* Sign In button at bottom */}
      <Box borderTopWidth="1px" borderColor="bg-accent-subtle">
        <SignInButton as={Link} href="/login">
          Sign In
        </SignInButton>
      </Box>
    </Flex>
  );
};
