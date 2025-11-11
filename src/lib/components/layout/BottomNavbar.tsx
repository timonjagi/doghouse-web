import { Button, ButtonProps, Flex, Icon, Stack, Text } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { ElementType, useCallback } from "react";
import { FiBell, FiClipboard, FiHome, FiList, FiSearch, FiUser } from "react-icons/fi";

export const BottomNavbar = () => {
  const router = useRouter();

  const onClickMenuLink = useCallback(
    (path) => {
      router.push(path);
    },
    [router.push]
  );

  return (
    <Flex
      bg="bg-accent"
      color="on-accent"
      justify="space-between"
      align="center"
      width="full"
      h="64px"
      as="nav"
      direction="row"
      display="fixed"
      bottom={0}
    >
      <NavButton
        label="Home"
        icon={FiHome}
        href="/dashboard"
        aria-current={
          router.pathname === '/dashboard' ? "page" : "false"
        }
      />

      <NavButton
        label="Breeds"
        icon={FiSearch}
        href="/dashboard/breeds"
        aria-current={
          router.pathname.includes("breeds") ? "page" : "false"
        }
      />

      <NavButton
        label="Listings"
        icon={FiList}
        href="/dashboard/listings"
        aria-current={
          router.pathname.includes("listings") ? "page" : "false"
        }
      />

      <NavButton
        label="Applications"
        icon={FiClipboard}
        href="/dashboard/applications"
        aria-current={
          router.pathname.includes("applications") ? "page" : "false"
        }
      />

      <NavButton
        label="Account"
        icon={FiUser}
        href="/account"
        aria-current={
          router.pathname.includes("account") ? "page" : "false"
        }
      />
    </Flex>
  );
};

interface NavButtonProps extends ButtonProps {
  icon: ElementType;
  label: string;
  href?: string;
  as?: ElementType;
  isExternal?: boolean;
  endElement?: any;
}

const NavButton = (props: NavButtonProps) => {
  const { icon, label, href, ...buttonProps } = props;

  return (
    <Button
      h="full"
      variant="ghost-on-accent"
      justifyContent="center"
      align="center"
      maxW="calc(100vw / 5)"
      as={Link}
      href={href}
      {...buttonProps}
    >
      <Stack spacing="1" align="center"
      >
        <Icon as={icon} boxSize="6" color="on-accent-subtle" />
        <Text fontSize="xs" color="on-accent-subtle">{label}</Text>

      </Stack>
    </Button>
  )
}