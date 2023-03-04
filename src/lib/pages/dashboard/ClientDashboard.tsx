import {
  HStack,
  Stack,
  Heading,
  useBreakpointValue,
  Button,
  Text,
} from "@chakra-ui/react";
import type { User } from "firebase/auth";
// import React from "react";

interface ClientDashboardProps {
  user: User;
}

const ClientDashboard = ({ user }: ClientDashboardProps) => {
  return (
    <HStack spacing="4" justify="space-between">
      <Stack spacing="1">
        <Heading
          size={useBreakpointValue({
            base: "xs",
            lg: "sm",
          })}
          fontWeight="medium"
        >
          Dashboard
        </Heading>
        <Text color="muted">Hi, {user?.displayName}</Text>
      </Stack>
      <Button variant="primary">Create</Button>
    </HStack>
  );
};
export default ClientDashboard;
