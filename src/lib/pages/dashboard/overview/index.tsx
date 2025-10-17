import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Img,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeaderButtonGroup from "./HeaderButtonGroup";
import { Loader } from "../../../components/ui/Loader";
import { useUserProfile } from "lib/hooks/queries";
import { MdCheckCircle } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { RadioCard } from "lib/components/ui/RadioCard";
import { RadioCardGroup } from "lib/components/ui/RadioCardGroup";
import next from "next";

const DashboardHome = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showWhatsNextModal, setShowWhatsNextModal] = useState(false);
  const router = useRouter();
  const { onClose } = useDisclosure();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const searchParams = useSearchParams();

  useEffect(() => {
    console.log(profile);
    if (profile && !profile?.onboarding_completed) {
      setShowWelcomeModal(true);
    }
  }, [profile]);

  useEffect(() => {
    const onboardingCompleted = searchParams.get('onboarding_completed');

    if (profile && profile.onboarding_completed && onboardingCompleted) {
      setShowWhatsNextModal(true)
    }
  }, [profile, searchParams]);

  if (profileLoading) {
    <Center h="full">
      <Loader />
    </Center>
  }

  return (
    <Container h="full">
      <Box h="full">
        <Box>
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
        isOpen={showWelcomeModal}
        size={{ base: "sm", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            <Welcome router={router} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        onClose={onClose}
        isOpen={showWhatsNextModal}
        size={{ base: "sm", lg: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p="0">
            <WhatsNext userRole={profile?.role} router={router} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

const Welcome: React.FC<{ router: any }> = ({ router }) => {
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

const WhatsNext: React.FC<{ userRole: string, router: any, onClose: any }> = ({ userRole, router, onClose }) => {
  const [selectedAction, setSelectedAction] = useState(null);

  const seekerNextSteps = [

    {
      title: 'Explore Breeds',
      description: 'Start exploring the different dog breeds available for adoption',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/breeds'
    },
    {
      title: 'View Matches',
      description: 'Browse through matches made by our algorithm based on your preferences',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/matches'
    },
    {
      title: 'Complete Profile',
      description: 'Upload your profile picture and other details about yourself',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/account/profile'
    },
  ]

  const breederNextSteps = [
    {
      title: 'Manage Breeds',
      description: 'Update your existing breeds and add more breeds to your profile',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/breeds'
    },
    {
      title: 'Add Listings',
      description: 'Add new listings of dogs that you would like to rehome',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/listings'
    },
  ]

  const nextSteps = userRole === 'seeker' ? seekerNextSteps : breederNextSteps;

  return (
    <Box>
      <Stack
        direction="column"
        justifyContent="center"
        justify="center"
        spacing={{ base: 6, md: 9 }}
        px={{ base: "6", sm: "8", lg: "16" }}
        py={{ base: "6", md: "8", lg: "16" }}
      >
        <Stack mx="auto" textAlign="center">
          <Heading size="md" letterSpacing="tight" colorScheme="brand">
            What's Next?
          </Heading>
          <Text color="muted" fontSize="sm">
            Looks like you're all set up! Let us know what you want to do next.
          </Text>
        </Stack>

        <RadioCardGroup
          spacing="3"
          onChange={setSelectedAction}
        >
          {nextSteps.map((option) => (
            <RadioCard key={option.title} value={option.href}>
              <Text color="emphasized" fontWeight="medium" fontSize="sm">
                {option.title}
              </Text>
              <Text color="muted" fontSize="sm">
                {option.description}
              </Text>
            </RadioCard>
          ))}
        </RadioCardGroup>



        <ButtonGroup w="full">
          <Button
            size="lg"
            w="full"
            variant="primary"
            onClick={() => {
              if (selectedAction) {
                router.push(selectedAction);
              }
              onClose();
            }}
            disabled={!selectedAction}
          >
            <span>Take Me there</span>
          </Button>
        </ButtonGroup>

      </Stack>
    </Box>
  )
}

export default DashboardHome;
