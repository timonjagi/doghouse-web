import {
  Stack,
  Text,
  Flex,
  Box,
  Img,
  useBreakpointValue,
  Spinner,
  Center,
  Heading,
  VStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useCurrentUser } from "../../hooks/queries";
import { BreederOnboardingFlow } from "./breeder";
import { SeekerOnboardingFlow } from "./seeker";
import { RadioButton } from "lib/components/ui/RadioButton";
import { RadioButtonGroup } from "lib/components/ui/RadioButtonGroup";

type OnboardingModalProps = {
  onClose: () => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Show loading spinner while checking authentication
  if (userLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  // Redirect if not authenticated
  if (userError || !user) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Text color="red.500" fontSize="lg">Please log in to continue with onboarding.</Text>
          <Text color="gray.600">You need to be authenticated to complete the onboarding process.</Text>
        </VStack>
      </Center>
    );
  }

  // If user already completed onboarding, show completion message
  if (user.user_metadata?.onboarding_completed) {
    return (
      <Center h="400px">
        <VStack spacing={6} textAlign="center">
          <Icon as={MdCheckCircle} boxSize={16} color="green.500" />
          <Heading size="lg">Welcome back! 🎉</Heading>
          <Text color="gray.600">Your onboarding is already complete. You can start exploring the platform.</Text>
          <Button onClick={onClose} colorScheme="brand">
            Continue to Dashboard
          </Button>
        </VStack>
      </Center>
    );
  }

  // If no role selected yet, show role selection
  if (!selectedRole && !user.user_metadata?.role) {
    return (
      <RoleSelectionStep onRoleSelect={setSelectedRole} />
    );
  }

  // Route to appropriate onboarding flow based on role
  if (selectedRole === "breeder" || user.user_metadata?.role === "breeder") {
    return <BreederOnboardingFlow onClose={onClose} />;
  }

  if (selectedRole === "seeker" || user.user_metadata?.role === "seeker") {
    return <SeekerOnboardingFlow onClose={onClose} />;
  }

  // Fallback
  return <RoleSelectionStep onRoleSelect={setSelectedRole} />;
};

// Role selection component
const RoleSelectionStep: React.FC<{ onRoleSelect: (role: string) => void }> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState("");

  const options = [
    {
      value: "seeker",
      label: "Dog Seeker",
      description: "I'm looking to adopt a dog",
      icon: "🔍",
    },
    {
      value: "breeder",
      label: "Dog Breeder",
      description: "I'm looking to rehome my dogs",
      icon: "🏠",
    },
  ];

  return (
    <Stack spacing="9" textAlign="center">
      <VStack spacing={6}>
        <Heading size="lg">Welcome to DogHouse Kenya! 🐕</Heading>
        <Text fontSize="lg" color="gray.600">
          How would you like to continue?
        </Text>
      </VStack>

      <RadioButtonGroup
        size="lg"
        value={selectedRole}
        onChange={(value) => {
          setSelectedRole(value);
          onRoleSelect(value);
        }}
      >
        {options.map((option) => (
          <RadioButton key={option.value} value={option.value}>
            <VStack spacing={2} align="center" p={4}>
              <Text fontSize="2xl">{option.icon}</Text>
              <Text fontWeight="bold" fontSize="lg">{option.label}</Text>
              <Text color="gray.600" fontSize="sm">{option.description}</Text>
            </VStack>
          </RadioButton>
        ))}
      </RadioButtonGroup>

      <Text fontSize="sm" color="gray.500">
        You can always change your role later in your profile settings.
      </Text>
    </Stack>
  );
};

export { OnboardingModal };
