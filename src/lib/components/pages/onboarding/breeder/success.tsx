import {
  Button,
  VStack,
  Text,
  Icon,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useCurrentUser } from "../../../../hooks/queries";
import { NotificationService } from "../../../../services/notificationService";

type SuccessProps = {
};

export const BreederSuccess: React.FC<SuccessProps> = () => {
  const { data: user } = useCurrentUser();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCompleteOnboarding = async () => {
    if (!user) return;

    setIsCompleting(true);
    try {
      // Complete breeder onboarding with subscriber creation
      await NotificationService.completeBreederOnboarding(user.id, {
        firstName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Breeder',
        email: user.email || '',
        phone: user.phone || undefined,
      });

      // Redirect to dashboard
      window.location.href = '/dashboard?onboarding_completed=true';
    } catch (error) {
      console.error('Failed to complete breeder onboarding:', error);
      // Still redirect even if notification setup fails
      window.location.href = '/dashboard?onboarding_completed=true';
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <VStack spacing="8" textAlign="center">
      <Icon as={MdCheckCircle} boxSize="40px" mr={0} color="green.500" />
      <Heading size="md">
        Profile Created 🎉
      </Heading>
      <Text fontSize="md" color="gray.600">
        Your breeder profile has been created successfully. You can now start creating your listings and connecting with dog seekers.
      </Text>

      <Button
        onClick={handleCompleteOnboarding}
        isLoading={isCompleting}
        loadingText="Setting up notifications..."
        w="full"
        colorScheme="brand"
        size="lg"
      >
        Start Exploring
      </Button>
    </VStack>
  );
};
