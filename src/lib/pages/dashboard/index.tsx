import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  Heading,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Success } from "../onboarding/old/05-success";
import HeaderButtonGroup from "./HeaderButtonGroup";
import { Loader } from "../../components/ui/Loader";
import { useUserProfile } from "lib/hooks/queries";

const DashboardHome = () => {
  const [selectedPost, setSelectedPost] = useState();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const router = useRouter();

  const { onClose } = useDisclosure();

  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const onViewPost = (post) => {
    setSelectedPost(post);
  };


  useEffect(() => {
    console.log(profile)
    if (profile && !profile?.onboarding_completed) {
      setShowOnboardingModal(true);
    }
  }, [profile]);

  if (profileLoading) {
    <Center h="full">
      <Loader />
    </Center>
  }

  return (
    <Container h="full">
      <Box h="full">
        <Box>
          {profile?.onboarding_completed && <HeaderButtonGroup profile={profile} />}
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
      </Box>

      <Modal
        onClose={onClose}
        isOpen={showOnboardingModal}
        size={{ base: "sm", sm: "md", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            <Welcome />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* <Modal onClose={onClose} isOpen={showSuccessAlert} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            <Success setShowSuccessAlert={setShowSuccessAlert} />
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </Container>
  );
};

const Welcome: React.FC = () => {
  const router = useRouter();
  return (
    <Box>
      <Stack
        direction="column"
        mt="16"
        justifyContent="center"
        justify="center"
        spacing={{ base: 6, md: 9 }}
        px={{ base: "6", sm: "8", lg: "16" }}
        py={{ base: "6", md: "8", lg: "16" }}
        align="center"
      >
        <Box position="relative" mx="auto">
          <Img
            src="images/logo.png"
            alt="Main Image"
            w="150"
            h="150"
            borderRadius="0.5rem 0.5rem 0 0"
            objectFit="cover"
            objectPosition="90% center"
          />
        </Box>

        <Stack mx="auto" textAlign="center">
          <Heading size="md" letterSpacing="tight">
            Welcome to Doghouse
          </Heading>
          <Text color="muted">
            We are happy to have you here! Before you get started, please take a few minutes to answer a few questions.
          </Text>
        </Stack>

        <ButtonGroup w="full">
          <Button
            type="submit"
            size="lg"
            w="full"
            variant="primary"
            onClick={() => router.push('/onboarding')}
          >
            <span>Get Started</span>
          </Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
};

export default DashboardHome;
