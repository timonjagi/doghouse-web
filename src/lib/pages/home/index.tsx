import {
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ActivityFeedCard from "./ActivityFeedCard";
import { FiUser, FiSettings, FiBell } from "react-icons/fi";
import { NewsletterForm } from "./NewsletterForm";
import { CompleteProfileBanner } from "./CompleteProfileBanner";
import { UserProfile } from "lib/models/user-profile";
import OnboardingModal from "../onboarding";
import Welcome from "../onboarding/00-welcome";
import { Success } from "../onboarding/05-success";

const Home = ({ activities }) => {
  const [user, loading, error] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({} as any);
  const [selectedPost, setSelectedPost] = useState();

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showOnboardingSteps, setShowOnboardingSteps] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);

  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const fetchUserProfile = async (): Promise<UserProfile> => {
    setLoadingUserProfile(true);
    console.log("laoding user profile");
    try {
      const response = await fetch(
        `/api/users/get-user?${new URLSearchParams({
          uid: user.uid,
        })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const profile = await response.json();
        console.log(profile);

        setUserProfile(profile);
        return profile;
      } else {
        setShowOnboardingModal(showOnboardingModal);
        console.log("user profile not found");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {});

  const onViewPost = (post) => {
    setSelectedPost(post);
  };

  const onClickMenuLink = (link) => {};

  const onCloseOnboardingModal = () => {
    setShowOnboardingModal(false);
    setShowSuccessAlert(true);
  };

  return (
    <Container>
      <HStack justify="space-between" align="start">
        <Heading pb="4" size={{ base: "xs", sm: "md" }}>
          Hi, {user.displayName} 👋
        </Heading>

        <HStack spacing="1" direction="row">
          <IconButton
            icon={<FiBell />}
            aria-label="Notifications"
            aria-current={
              router.pathname.includes("account/notifications")
                ? "page"
                : "false"
            }
            onClick={() => onClickMenuLink("/account/notifications")}
          />

          <IconButton
            aria-label='"'
            icon={<FiUser />}
            aria-current={
              router.pathname.includes("account/profile") ? "page" : "false"
            }
            onClick={() => onClickMenuLink("/account/profile")}
          />

          <IconButton
            icon={<FiSettings />}
            onClick={() => onClickMenuLink("/account/settings")}
            aria-current={
              router.pathname.includes("account/settings") ? "page" : "false"
            }
            aria-label="Settings"
          />
        </HStack>
      </HStack>
      {/* <NewsletterForm /> */}

      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "5", lg: "8" }}
        justify="space-between"
      >
        <Stack
          spacing="4"
          flex="1"
          direction="column"
          w={{ base: "full", lg: "lg" }}
          minW="sm"
        >
          <ActivityFeedCard
            activities={activities}
            userProfile={userProfile}
            isDesktop={isDesktop}
            onViewPost={onViewPost}
          />
        </Stack>

        <Flex direction="column" flex="1" maxW={{ base: "none", lg: "sm" }}>
          {/* <CompleteProfileBanner />*/}
          {/* <NewsletterForm /> */}
        </Flex>
      </Stack>

      <Modal
        onClose={onClose}
        isOpen={showOnboardingModal}
        size={{ base: "sm", sm: "md", md: "lg" }}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            {!showOnboardingSteps && (
              <Welcome setShowOnboardingSteps={setShowOnboardingSteps} />
            )}
            {showOnboardingSteps && (
              <OnboardingModal
                userProfile={userProfile}
                onClose={() => onCloseOnboardingModal()}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal onClose={onClose} isOpen={showSuccessAlert} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            <Success setShowSuccessAlert={setShowSuccessAlert} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Home;
