import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { MdCheckCircle } from "react-icons/md";

type SuccessProps = {
  onClose: () => void;
};

export const SeekerSuccess: React.FC<SuccessProps> = ({ onClose }) => {
  return (
    <VStack spacing="8" textAlign="center">
      <Alert
        status="success"
        variant="success"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="300px"
        borderRadius="lg"
      >
        <AlertIcon as={MdCheckCircle} boxSize="40px" mr={0} color="green.500" />
        <AlertTitle mt={4} mb={2} fontSize="2xl">
          Welcome to DogHouse Kenya! 🎉
        </AlertTitle>
        <AlertDescription maxWidth="md" fontSize="lg">
          Your profile and wanted listing have been created successfully. Breeders can now find and contact you about available puppies.
        </AlertDescription>
      </Alert>

      <VStack spacing={4}>
        <Text fontSize="md" color="gray.600">
          <strong>What's next?</strong>
        </Text>
        <VStack spacing={2} fontSize="sm" color="gray.500" align="start">
          <Text>• Browse available litters from verified breeders</Text>
          <Text>• Receive notifications when matching puppies are available</Text>
          <Text>• Connect with breeders via WhatsApp</Text>
          <Text>• Track your applications in your dashboard</Text>
        </VStack>
      </VStack>

      <Button
        onClick={() => window.location.href = '/dashboard'}
        w="full"
        colorScheme="brand"
        size="lg"
      >
        Start Exploring
      </Button>
    </VStack>
  );
};
