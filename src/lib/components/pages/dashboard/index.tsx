import {
  Box,
  Container,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Stack,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Img,
  Icon,
  useColorModeValue as mode,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "../../ui/Loader";
import { useCurrentUser, useUserProfile } from "lib/hooks/queries";
import { MdCheckCircle } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { RadioCard } from "../../ui/RadioCard";
import { RadioCardGroup } from "../../ui/RadioCardGroup";
import { NextSeo } from "next-seo";
import BreederDashboardOverview from "./BreederDashboardOverview";
import SeekerDashboardOverview from "./SeekerDashboardOverview";
import AdminDashboardOverview from "./AdminDashboardOverview";
import SeekerExploreOverview from "../../ui/ExploreOverview";

const DashboardHome = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showWhatsNextModal, setShowWhatsNextModal] = useState(false);
  const router = useRouter();
  const { onClose } = useDisclosure();
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();

  const profile = userProfile || (user ? {
    id: user.id,
    role: user.user_metadata?.role,
    onboarding_completed: user.user_metadata?.onboarding_completed,
  } : null);

  const [showBanner, setShowBanner] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only determine modals when loading is finished
    if (userLoading || profileLoading) return;

    const onboardingCompletedParam = searchParams.get('onboarding_completed');

    if (profile && (profile.onboarding_completed || onboardingCompletedParam)) {
      setShowWhatsNextModal(true);
      setShowWelcomeModal(false); // Ensure conflict is resolved
    } else if (profile && !profile.onboarding_completed) {
      setShowWelcomeModal(true);
      setShowWhatsNextModal(false);
    }
  }, [profile, searchParams, userLoading, profileLoading]);

  // Combined loading state
  if (userLoading || profileLoading) {
    return <Loader />
  }

  // Error handling
  if (userError || profileError) {
    return (
      <Container centerContent py={10}>
        <Alert status='error' borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading dashboard</AlertTitle>
            <AlertDescription>
              {userError?.message || profileError?.message || "An unexpected error occurred."}
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    )
  }

  // Show role-specific dashboard if user is onboarded
  const renderRoleSpecificDashboardOverview = () => {
    switch (profile?.role) {
      case 'breeder':
        return <BreederDashboardOverview />;
      case 'seeker':
        return <SeekerExploreOverview />;
      case 'admin':
        return <AdminDashboardOverview />;
      default:
        break;
    }

  }

  // Show onboarding flow for new users
  return (
    <Container maxW="7xl">
      <NextSeo title="Dashboard" />

      {renderRoleSpecificDashboardOverview()}
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
            src={mode('images/pethouse-logo-icon-light.png', 'images/pethouse-logo-icon-dark.png')}
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
            Welcome to Pethouse
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
      href: '/dashboard/breeds/browse'
    },
    {
      title: 'View Matches',
      description: 'Browse through matches made by our algorithm based on your preferences',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/matches'
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
