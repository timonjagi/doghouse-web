import {
  Button,
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

const Dashboard = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <Container
        pt={{
          base: "8",
          lg: "12",
        }}
        pb={{
          base: "12",
          lg: "24",
        }}
      >
        <NextSeo title="Dashboard" />

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
            <Text color="muted">All important metrics at a glance</Text>
          </Stack>
          <Button variant="primary" hidden={!user?.displayName}>
            Create
          </Button>
        </HStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
