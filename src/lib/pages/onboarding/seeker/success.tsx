import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  Text,
  Icon,
  List,
  ListIcon,
  ListItem,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { MdCheckCircle } from "react-icons/md";

type SuccessProps = {
};

export const SeekerSuccess: React.FC<SuccessProps> = () => {
  return (
    <VStack spacing="8" textAlign="center">
      <Icon as={MdCheckCircle} boxSize="40px" mr={0} color="green.500" />
      <Heading size="md">
        Profile Created 🎉
      </Heading>
      <Text fontSize="md" color="gray.600">
        Your profile has been created successfully. You can now start searching for litters and connecting with verified breeders.
      </Text>

      <Button
        onClick={() => window.location.href = '/dashboard?onboarding=true&user_type=seeker'}
        w="full"
        colorScheme="brand"
        size="lg"
      >
        Start Exploring
      </Button>
    </VStack >
  );
};
