import {
  Button,
  VStack,
  Text,
  Icon,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { MdCheckCircle } from "react-icons/md";

type SuccessProps = {
};

export const BreederSuccess: React.FC<SuccessProps> = () => {
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
