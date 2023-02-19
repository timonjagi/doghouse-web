import { Flex } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { CompleteProfileBanner } from "lib/components/auth/CompleteProfileBanner";
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
    <>
      {user && !user?.displayName && <CompleteProfileBanner />}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        w="full"
      >
        <NextSeo title="Dashboard" />
      </Flex>
    </>
  );
};

export default Dashboard;
