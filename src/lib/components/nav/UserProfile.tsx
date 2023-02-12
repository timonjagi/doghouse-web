import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { FiChevronDown } from "react-icons/fi";

// import { useUser } from "../hooks/useUser";

export const UserProfile = ({ user, isDesktop }: any) => {
  const { firstname, lastname, image, email } = user;

  // const { logoutUser } = useUser();

  const name = `${firstname} ${lastname}`;

  // const onLogout = () => {
  //   logoutUser();
  // };

  return (
    <>
      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size="sm"
                  src="https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{name}</Text>
                  {/* <Text fontSize='xs' color='gray.600'>
                    Admin
                  </Text> */}
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => {}}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>

      <HStack spacing="3" ps="2">
        <Avatar name={name} src={image} boxSize="10" />
        <Box>
          <Text color="on-accent" fontWeight="medium" fontSize="sm">
            {name}
          </Text>
          <Text color="on-accent-muted" fontSize="sm">
            {email}
          </Text>
        </Box>
      </HStack>
    </>
  );
};
