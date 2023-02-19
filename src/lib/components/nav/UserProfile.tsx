import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

import { auth } from "lib/firebase/client";

interface UserProfileProps {
  name: string;
  image: string;
  phoneNumber: string;
  onClose: () => void;
}

export const UserProfile = (props: UserProfileProps) => {
  const { name, image, phoneNumber, onClose } = props;

  const [signOut, loading, error] = useSignOut(auth);
  const toast = useToast();
  const router = useRouter();

  const onLogout = async () => {
    onClose();

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

        return await router.push("/");
      }
    } catch (err) {
      toast({
        title: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <HStack spacing="3" ps="2">
      <Avatar name={name} src={image} boxSize="10" />
      <Box>
        <Text color="on-accent" fontWeight="medium" fontSize="sm">
          {name}
        </Text>
        <Text color="on-accent-muted" fontSize="sm">
          {phoneNumber}
        </Text>
      </Box>
      <Spacer />
      <IconButton
        variant="on-accent"
        aria-label="Logout"
        icon={<FiLogOut />}
        onClick={onLogout}
      />
    </HStack>
  );
};
