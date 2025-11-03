import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSignOut } from "lib/hooks/queries";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { useRouter } from "next/router";
// import * as React from "react";
import { FiLogOut } from "react-icons/fi";


interface UserProfileProps {
  profile: any;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile, onClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toast = useToast();
  const router = useRouter();

  const signOut = useSignOut();
  const onLogout = async () => {
    onClose();

    try {
      await signOut.mutateAsync();
      toast({
        title: "Logged out successfully",
        description: "",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      router.replace("/login");

    } catch (error) {
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
    <HStack spacing="3" px="2">
      <Avatar name={profile?.display_name} src={profile?.avatar_url} boxSize="10" />
      <Box>
        <Text color="on-accent" fontWeight="medium" fontSize="sm">
          {profile?.display_name}
        </Text>
        <Text color="on-accent-muted" fontSize="sm">
          {profile?.email}
        </Text>
      </Box>
      <Spacer />
      <IconButton
        colorScheme="brand-on-accent"
        aria-label="Logout"
        icon={<FiLogOut />}
        onClick={onLogout}
      />
    </HStack>
  );
};
