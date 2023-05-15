import { Box, Container } from "@chakra-ui/react";
import type { User } from "firebase/auth";
import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

import BreederDashboard from "./BreederDashboard";

const Dashboard = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isBreeder, setIsBreeder] = useState(false);

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.push("/login");
      return;
    }

    const getClaims = async (authUser: User) => {
      const tokenResult = await authUser.getIdTokenResult(true);
      if (tokenResult) {
        const { claims } = tokenResult;
        setIsBreeder(claims.isBreeder);
      }
    };

    if (user) {
      getClaims(user);
    }
  }, [user, loading, error, router]);

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
        {user && isBreeder && <BreederDashboard user={user} />}
      </Container>
    </Box>
  );
};

export default Dashboard;
