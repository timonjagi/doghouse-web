import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type successProps = {
  currentStep: any;
  setStep: any;
};

export const Success: React.FC<successProps> = ({ currentStep, setStep }) => {
  return (
    <Box>
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Profile created!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Thanks for createing your profile. Upload your profile picture to let
          people know who you are.
        </AlertDescription>
      </Alert>

      <Button as={Link} href="/account/profile" w="full" colorScheme="brand">
        Upload profile picture
      </Button>
    </Box>
  );
};
