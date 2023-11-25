import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiDownloadCloud } from "react-icons/fi";
import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Services from "../services";

const Dashboard = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // load user document - check
    // check user groups - check // saved alongside user
    // display on sidebar
    // save user doc as atom

    const fetchUserDoc = async () => {
      const response = await fetch(
        `/api/users/get-user?${new URLSearchParams({
          uid: user.uid,
        })}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 404) {
        console.log(response);
        console.log("User doc not found");
        router.push("/signup");
      }
    };

    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      fetchUserDoc();
    }
  }, [user, loading]);

  return (
    <Flex
      as="section"
      direction={{ base: "column", lg: "row" }}
      height="100vh"
      bg="bg-canvas"
      overflowY="auto"
    >
      <Box bg="bg-accent" flex="1">
        <Box bg="bg-canvas" height="full">
          <Container py="8" height="full">
            {router.pathname.includes("services") && <Services />}
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
