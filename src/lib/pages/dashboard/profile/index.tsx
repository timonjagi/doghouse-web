import {
  Box,
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import type { User } from "firebase/auth";
import { useRouter } from "next/router";
// import * as React from "react";
import { useState, useEffect } from "react";
import { HiPencilAlt } from "react-icons/hi";

import { CardContent } from "./CardContent";
import { CardWithAvatar } from "./CardWithAvatar";
import { UserInfo } from "./UserInfo";
import EthicalQuestionairreCard from "./EthicalQuestionairreCard";
import { UserProfile } from "lib/components/auth/UserProfile";
import UserProfileForm from "./UserProfileForm";
import { doc, getDoc } from "firebase/firestore";
import { CompleteProfileBanner } from "lib/pages/dashboard/CompleteProfileBanner";
import { NewsletterForm } from "lib/pages/dashboard/NewsletterForm copy";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";

const Profile = () => {
  const { user, loading } = useSupabaseAuth();
  // eslint-disable-next-line
  const [isBreeder, setIsBreeder] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const [userProfile, setUserProfile] = useState({} as any);
  const [loadingUserProfile, setLoadingUserProfile] = useState(true);

  // const fetchUserProfile = async () => {
  //   setLoadingUserProfile(true);
  //   try {
  //     const userDocRef = doc(fireStore, "users", user.uid as string);

  //     const userDoc = await getDoc(userDocRef);
  //     setUserProfile({ id: userDoc.id, ...userDoc.data() });
  //   } catch (error) {
  //     toast({
  //       title: "Error loading profile",
  //       description: error.message,
  //       status: "error",
  //     });
  //   }

  //   setLoadingUserProfile(false);
  // };

  // useEffect(() => {
  //   if (!loading && user) {
  //     fetchUserProfile();
  //   }
  // }, [user, loading]);

  // useEffect(() => {
  //   if (!loading && (!user || error)) {
  //     router.push("/login");
  //     return;
  //   }

  //   const getClaims = async (authUser: User) => {
  //     const tokenResult = await authUser.getIdTokenResult(true);
  //     if (tokenResult) {
  //       const { claims } = tokenResult;
  //       setIsBreeder(claims.isBreeder);
  //     }
  //   };

  //   if (user) {
  //     getClaims(user);
  //   }
  // }, [user, loading, error, router]);

  const onCloseModal = () => {
    onClose();
    //fetchUserProfile();
  };

  return (
    <>
      {" "}
      {loading ? (
        <Spinner size="lg" colorScheme="brand" />
      ) : (
        <Container>
          <Box as="section" pt="20" pb="12" position="relative">
            <Box position="absolute" inset="0" height="32" bg="brand.600" />
            <CardWithAvatar
              maxW="2xl"
              avatarProps={{
                src: userProfile?.profilePhotoUrl,
                name: userProfile?.name,
              }}
              action={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<HiPencilAlt />}
                  onClick={onToggle}
                >
                  Edit
                </Button>
              }
            >
              <CardContent>
                <Heading size="md" fontWeight="bold" letterSpacing="tight">
                  {userProfile && userProfile?.name}
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.400")}>
                  {user && user?.email}
                </Text>
                <UserInfo
                  location={"Nairobi, Kenya"}
                  website="esther.com"
                  memberSince={new Date(
                    user?.created_at
                  ).toDateString()}
                />
              </CardContent>
            </CardWithAvatar>
          </Box>
        </Container>
      )}
      <Modal onClose={onClose} isOpen={isOpen} size={{ base: "xs", md: "sm" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <UserProfileForm userProfile={userProfile} onClose={onCloseModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default Profile;
