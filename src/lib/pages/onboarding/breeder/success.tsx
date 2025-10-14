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
};

export const BreederSuccess: React.FC<SuccessProps> = () => {
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
          Your breeder profile has been created successfully. You can now start adding your breeds and connecting with dog seekers.
        </AlertDescription>
      </Alert>

      <VStack spacing={4}>
        <Text fontSize="md" color="gray.600">
          <strong>What's next?</strong>
        </Text>
        <VStack spacing={2} fontSize="sm" color="gray.500" align="start">
          <Text>• Upload photos of your breeds</Text>
          <Text>• Add your first litter</Text>
          <Text>• Start receiving inquiries from seekers</Text>
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
