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

interface BreederDashboardProps {
  user: User;
}

const BreederDashboard = ({ user }: BreederDashboardProps) => {
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
          Hi, {user.displayName?.split(" ")[0]}
        </Heading>
        <Text color="muted">All important metrics at a glance</Text>
      </Stack>
      <Button variant="primary">Create</Button>
    </HStack>
  );
};
export default BreederDashboard;
