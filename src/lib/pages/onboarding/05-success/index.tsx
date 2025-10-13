import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type successProps = {
  setShowSuccessAlert: any;
};

export const Success: React.FC<successProps> = ({ setShowSuccessAlert }) => {
  return (
    <Stack
      spacing="8"
      px={{ base: "6", sm: "8", lg: "16", xl: "32" }}
      py={{ base: "6", md: "8" }}
    >
      <Alert
        status="success"
        variant="success"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="24" mr={0} color="brand.500" />
        <AlertTitle mt={4} mb={1} fontSize="xl">
          Profile created 🎉
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Thanks for the info. Let's show you around, shall we?
        </AlertDescription>
      </Alert>

      <Button
        onClick={() => setShowSuccessAlert(false)}
        w="full"
        colorScheme="brand"
      >
        Start tour
      </Button>
    </Stack>
  );
};
