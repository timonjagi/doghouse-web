import {
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

export const Confirm = (props) => {
  return (
    <Stack spacing="5">
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
          You&apos;re all set!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Thanks for creating your account. Now you are ready to start posting
          offers
        </AlertDescription>
      </Alert>
      <Button as={Link} href="/dashboard" variant="primary">
        Continue to Dashboard
      </Button>
    </Stack>
  );
};
