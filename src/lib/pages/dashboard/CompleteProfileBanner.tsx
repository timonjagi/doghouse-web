import {
  Box,
  Button,
  CloseButton,
  Container,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { FiArrowRight, FiMail, FiUser } from "react-icons/fi";
import UserProfileForm from "../account/profile/UserProfileForm";
import { useState } from "react";
import { user } from "firebase-functions/v1/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, fireStore } from "lib/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";

export const CompleteProfileBanner = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);

  const [userProfile, setUserProfile] = useState({} as any);
  const [loadingUserProfile, setLoadingUserProfile] = useState(true);

  const { isOpen, onToggle, onClose } = useDisclosure();

  const fetchUserProfile = async () => {
    setLoadingUserProfile(true);
    try {
      const userDocRef = doc(fireStore, "users", user.uid as string);

      const userDoc = await getDoc(userDocRef);
      setUserProfile({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
      toast({
        title: "Error loading profile",
        description: error.message,
        status: "error",
      });
    }

    setLoadingUserProfile(false);
  };

  React.useEffect(() => {
    if (!loading && user) {
      fetchUserProfile();
    }
  }, [user, loading]);

  return (
    <Box as="section" pb={{ base: "4", md: "6" }}>
      <Box bg="bg-surface">
        <Container py={{ base: "4", md: "4" }} position="relative">
          <CloseButton
            display={{ md: "none" }}
            position="absolute"
            right="2"
            top="2"
          />
          <Stack
            direction={{ base: "column", md: "column" }}
            justify="space-between"
            spacing={{ base: "3", md: "4" }}
          >
            <Stack
              spacing="6"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Stack spacing="2">
                <HStack>
                  <Square size="12" borderRadius="md">
                    <Icon as={FiUser} boxSize="6" color="subtle" />
                  </Square>

                  <Text fontWeight="medium" fontSize="lg">
                    Complete your profile
                  </Text>
                </HStack>
                <Text color="muted" fontSize="sm">
                  Add a profile photo so guys can know you better. You can also
                  list more breeds, upload their photos and update their
                  veterinary information.
                </Text>
              </Stack>
            </Stack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={{ base: "4", md: "8" }}
              align={{ base: "stretch", md: "center" }}
              w="full"
            >
              <Button
                variant="ghost"
                bg="bg-muted"
                width="full"
                onClick={onToggle}
                disabled={!userProfile.name}
              >
                Update Profile
              </Button>

              <Button
                variant="ghost"
                width="full"
                rightIcon={<FiArrowRight />}
                as={Link}
                href="/my-breeds"
              >
                Manage Breeds
              </Button>
            </Stack>
          </Stack>
        </Container>

        <Modal
          onClose={onClose}
          isOpen={isOpen}
          size={{ base: "xs", md: "sm" }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <UserProfileForm userProfile={userProfile} onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};
