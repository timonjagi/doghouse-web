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
import { useRouter } from "next/router";
import type React from "react";
import { useSignOut } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

type UserProfileMenuProps = {
  name: string;
  image: string;
  phoneNumber: string;
};

const UserProfileMenu: React.FC<UserProfileMenuProps> = (
  props: UserProfileMenuProps
) => {
  const { name, image, phoneNumber } = props;
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signOut, loading, error] = useSignOut(auth);
  const toast = useToast();

  const onLogout = async () => {
    try {
      const success = await signOut();

      if (success) {
        toast({
          title: "Logged out successfully",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        router.push("/");
      }
      return success;
    } catch (err) {
      toast({
        title: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    return 0;
  };

  return (
    <Menu variant="primary-on-accent">
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
        <Center>
          <Avatar name={name} src={image} size="2xl" />
        </Center>
        <br />
        <Center>
          <Box>
            <Text color="primary" fontWeight="medium" fontSize="md">
              {name}
            </Text>
            <Text color="on-accent-muted" fontSize="sm">
              {phoneNumber}
            </Text>
          </Box>
        </Center>
        <MenuDivider />
        {/* <MenuItem>Your Servers</MenuItem> */}
        <MenuItem cursor="pointer">Account Settings</MenuItem>
        <MenuItem as="button" cursor="pointer" onClick={onLogout}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default UserProfileMenu;
