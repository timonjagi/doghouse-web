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
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

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
      console.log(user.uid);
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
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="bg-accent" flex="1">
        <Box bg="bg-canvas" height="full">
          <Container py="8" height="full">
            <Stack spacing={{ base: "8", lg: "6" }} height="full">
              <Stack
                spacing="4"
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
                align={{ base: "start", lg: "center" }}
              >
                <Stack spacing="1">
                  <Heading
                    size={useBreakpointValue({ base: "xs", lg: "sm" })}
                    fontWeight="medium"
                  >
                    Dashboard
                  </Heading>
                  <Text color="muted">All important metrics at a glance</Text>
                </Stack>
                <HStack spacing="3">
                  <Button
                    variant="secondary"
                    leftIcon={<FiDownloadCloud fontSize="1.25rem" />}
                  >
                    Download
                  </Button>
                  <Button variant="primary">Create</Button>
                </HStack>
              </Stack>
              <Box
                bg="bg-surface"
                borderRadius="lg"
                borderWidth="1px"
                height="full"
              />
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard;
