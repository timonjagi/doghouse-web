import { Box, Container } from "@chakra-ui/react";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "lib/firebase/client";

import BreederDashboard from "./BreederDashboard";

const Dashboard = () => {
  // const router = useRouter();
  const [user] = useAuthState(auth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [customClaims, setCustomClaims] = useState({} as any);

  // useEffect(() => {
  //   // if (!user) {
  //   //   router.push("/login");
  //   // }

  //   const getClaims = async () => {
  //     const tokenResult = await user?.getIdTokenResult();
  //     if (tokenResult) {
  //       const { claims } = tokenResult;
  //       setCustomClaims(claims);
  //     }
  //   };

  //   if (user) {
  //     getClaims();
  //   }
  // }, [user, router]);

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
        {user && <BreederDashboard user={user} />}
      </Container>
    </Box>
  );
};

export default Dashboard;
