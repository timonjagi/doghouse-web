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
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeaderButtonGroup from "./HeaderButtonGroup";
import { Loader } from "../../components/ui/Loader";
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
        isOpen={showWelcomeModal}
        size={{ base: "sm", sm: "md", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            <Welcome router={router} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal onClose={onClose} isOpen={showWhatsNextModal} size="sm">
        <ModalOverlay />
        <ModalContent>
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
      title: 'View Matching Puppies',
      description: 'Browse matching puppies from verified breeders and start applying for them',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/explore'
    },
    {
      title: 'Add a Wanted Listing',
      description: `Can&apos;t find a puppy you like? Create a wanted listing for the perfect pup`,
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/dashboard/listings/create'
    },
    {
      title: 'Complete your Profile',
      description: 'Upload your profile picture and other details about yourself',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/account/profile'
    },
  ]

  const breederNextSteps = [
    {
      title: 'Add Breeds',
      description: 'Add more breeds to your Profile',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/account/breeds'
    },
    {
      title: 'Add Your First Litter',
      description: 'Add your first litter or puppy for sale',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/account/litters'
    },
    {
      title: 'Manage Your Listings',
      description: 'Manage your listings in your dashboard',
      icon: <Icon as={MdCheckCircle} color='green.500' />,
      href: '/account/listings'
    },
  ]

  const nextSteps = userRole === 'seeker' ? seekerNextSteps : breederNextSteps;

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
      >
        <Box position="relative" mx="auto">
          <Img
            src="images/logo.png"
            alt="Main Image"
            w="100"
            h="100"
            borderRadius="0.5rem 0.5rem 0 0"
            objectFit="cover"
            objectPosition="90% center"
          />
        </Box>
        <Stack mx="auto" textAlign="center">
          <Heading size="md" letterSpacing="tight">
            What's Next?
          </Heading>
          {/* <Text color="muted">
            We are happy to have you here! Before you get started, please take a few minutes to answer a few questions.
          </Text> */}
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
