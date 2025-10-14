import {
  Box,
  Center,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ActivityFeedCard from "./ActivityFeedCard";
import { UserProfile } from "lib/models/user-profile";
import OnboardingModal from "../onboarding";
import Welcome from "../onboarding/00-welcome";
import { Success } from "../onboarding/05-success";
import HeaderButtonGroup from "./HeaderButtonGroup";
import { Loader } from "../../components/ui/Loader";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";

const Home = () => {
  const { user, loading } = useSupabaseAuth();
  const [selectedPost, setSelectedPost] = useState();

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showOnboardingSteps, setShowOnboardingSteps] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loadingUserProfile, setLoadingUserProfile] = useState(false);

  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const toast = useToast();

  const fetchUserProfile = async (): Promise<UserProfile> => {
    setLoadingUserProfile(true);
    try {
      console.log("loading user profile", user?.id);

      // const response = await fetch(
      //   `/api/users/get-user?${new URLSearchParams({
      //     uid: user.uid,
      //   })}`,
      //   {
      //     method: "GET",
      //     headers: { "Content-Type": "application/json" },
      //   }
      // );
      // console.log("Response status: ", response.status);

      // if (response.status === 200) {
      //   const profile = await response.json();
      //   console.log("profile ", profile);

      //   localStorage.setItem("profile", JSON.stringify(profile));
      // } else {
      //   setShowOnboardingModal(true);
      //   console.log("user profile not found");
      // }

      const profile = JSON.parse(localStorage.getItem("profile"));
      if (!profile) {
        setShowOnboardingModal
      }
      setLoadingUserProfile(false);
      return;
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
      });
      setLoadingUserProfile(false);
    }
  };

  useEffect(() => {
    // if (!loading && !error && !user) {
    //   toast({
    //     title: "You're not logged in",
    //     description: "Please login to access your dashboard",
    //     status: "info",
    //   });
    //   router.push("/");
    //} else if (!loading && user.uid) {
    fetchUserProfile();
    // }
  }, []);

  const onViewPost = (post) => {
    setSelectedPost(post);
  };

  const onCloseOnboardingModal = () => {
    setShowOnboardingModal(false);
    setShowSuccessAlert(true);
  };

  return (
    <Container h="full">
      <Box h="full">
        {loadingUserProfile ? (
          <Center h="full">
            <Loader />
          </Center>
        ) : (
          <Box>
            <HeaderButtonGroup />
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
                {/* <ActivityFeedCard
                  activities={activities}
                  userProfile={userProfile}
                  isDesktop={isDesktop}
                  onViewPost={onViewPost}
                /> */}
              </Stack>

              <Flex
                direction="column"
                flex="1"
                maxW={{ base: "none", lg: "sm" }}
              >
                {/* <CompleteProfileBanner />*/}
                {/* <NewsletterForm /> */}
              </Flex>
            </Stack>
          </Box>
        )}
      </Box>

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
                userProfile={JSON.parse(localStorage.getItem("profile"))}
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
