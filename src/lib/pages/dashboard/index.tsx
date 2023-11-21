import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { User } from "firebase/auth";
import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

import BreederDashboard from "./BreederDashboard";
import ClientDashboard from "./ClientDashboard";
import { NextSeo } from "next-seo";
import { BreedGroups } from "../home/BreedGroups";

const Dashboard = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isBreeder, setIsBreeder] = useState(false);

  useEffect(() => {
    if (!loading && !user?.uid) {
      router.push("/~");
      return;
    }

    // const getClaims = async (authUser: User) => {
    //   const tokenResult = await authUser.getIdTokenResult(true);
    //   if (tokenResult) {
    //     const { claims } = tokenResult;
    //     setIsBreeder(claims.isBreeder);
    //   }
    // };

    // if (user) {
    //   getClaims(user);
    // }
  }, [user, loading, error, router]);

  return (
    <Box as="section" height="100vh" overflowY="auto">
      <NextSeo title="Dashboard" />

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
        <HStack spacing="4" justify="space-between">
          <Stack spacing="1">
            <Heading
              size={useBreakpointValue({
                base: "xs",
                lg: "sm",
              })}
              fontWeight="medium"
            >
              Hi, {user?.displayName?.split(" ")[0]}
            </Heading>
            <Text color="muted">All important metrics at a glance</Text>
          </Stack>
          <Button variant="primary">Create</Button>
        </HStack>

        <BreedGroups />
      </Container>
    </Box>
  );
};

export default Dashboard;
