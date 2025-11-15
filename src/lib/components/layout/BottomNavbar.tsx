import { Button, ButtonProps, Flex, Icon, Stack, Text } from "@chakra-ui/icons";
import { useUserProfile } from "lib/hooks/queries/useUserProfile";
import Link from "next/link";
import { useRouter } from "next/router";
import { ElementType } from "react";
import { FiClipboard, FiGitlab, FiHome, FiList, FiSearch, FiTarget } from "react-icons/fi";
import { LuDog } from "react-icons/lu";

export const BottomNavbar = () => {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  return (
    <Flex
      bg="bg-accent"
      color="on-accent"
      justify="space-evenly"
      align="center"
      width="full"
      h="64px"
      as="nav"
      direction="row"
      display="fixed"
      bottom={0}
      wrap="nowrap"
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
        icon={profile?.role === "breeder" ? LuDog : FiSearch}
        href="/dashboard/breeds"
        aria-current={
          router.pathname.includes("breeds") ? "page" : "false"
        }

      />

      <NavButton
        label="Matches"
        icon={FiTarget}
        href="/dashboard/matches"
        aria-current={
          router.pathname.includes("matches") ? "page" : "false"
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
      w="calc(100vw / 5)"
      as={Link}
      href={href}
      borderRadius={0}
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