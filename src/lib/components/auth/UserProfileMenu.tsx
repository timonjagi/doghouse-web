import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Menu,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import type React from "react";
import { useRouter } from "next/router";
import { MdDashboard, MdLogout, MdOutlineAccountCircle } from "react-icons/md";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";

type UserProfileMenuProps = {
  name: string;
  image: string;
  email: string;
};

const UserProfileMenu: React.FC<UserProfileMenuProps> = (
  props: UserProfileMenuProps
) => {
  const { name, image, email } = props;

  const toast = useToast();
  const router = useRouter();
  const { signOut } = useSupabaseAuth();

  const onLogout = async () => {
    try {
      await signOut();

      toast({
        title: "Logged out successfully",
        description: "",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      router.push("/");
    } catch (err) {
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          rounded="full"
          variant="link"
          cursor="pointer"
          minW={0}
          color="on-accent"
        >
          <Avatar name={name} src={image} boxSize="10" />
        </MenuButton>
        <MenuList alignItems="center" color="brand.400">
          <br />
          <Center pb="4">
            <Avatar name={name} src={image} size="2xl" />
          </Center>
          <Center>
            <Box>
              <Text color="primary" fontWeight="medium" fontSize="md">
                {name}
              </Text>
              <Text color="on-accent-muted" fontSize="sm">
                {email}
              </Text>
            </Box>
          </Center>
          <MenuDivider />
          <MenuItem
            icon={<MdDashboard />}
            cursor="pointer"
            as="a"
            href="/dashboard"
          >
            Go to Dashboard
          </MenuItem>

          {/* <MenuItem
            icon={<MdOutlineAccountCircle />}
            cursor="pointer"
            as="a"
            href="/account"
          >
            Account
          </MenuItem> */}
          <MenuItem
            icon={<MdLogout />}
            cursor="pointer"
            as="button"
            onClick={onLogout}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
export default UserProfileMenu;
