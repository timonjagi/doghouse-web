import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FiDownloadCloud, FiSearch } from "react-icons/fi";
import { Sidebar } from "../../layout/Sidebar";
import { Navbar } from "../../layout/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Services from "../services";
import { NextSeo } from "next-seo";

const Home = ({ activity }) => {
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
    <Box
      as="section"
      bg="bg-surface"
      pt={{ base: "4", md: "8" }}
      pb={{ base: "12", md: "24" }}
    >
      <Container>
        <NextSeo title="Home" />

        <Stack spacing="5">
          <Stack
            spacing="4"
            direction={{ base: "column", md: "row" }}
            justify="space-between"
          >
            <Box>
              <Text fontSize="lg" fontWeight="medium">
                Activity feed
              </Text>
              <Text color="muted" fontSize="sm">
                All updates from the past hour
              </Text>
            </Box>
            <InputGroup maxW={{ sm: "xs" }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="muted" boxSize="5" />
              </InputLeftElement>
              <Input placeholder="Search" />
            </InputGroup>
          </Stack>
          <Divider />

          <Box bg="bg-surface" py="4">
            <Stack divider={<StackDivider />} spacing="4">
              {activity.map((act) => (
                <Stack key={act.id} fontSize="sm" px="4" spacing="4">
                  <Stack direction="row" justify="space-between" spacing="4">
                    <HStack spacing="3">
                      <Avatar src={act.userProfileUrl} boxSize="10">
                        <AvatarBadge boxSize="4" bg="active" />
                      </Avatar>
                      <Box>
                        <Text fontWeight="medium" color="emphasized">
                          {act.userName}
                        </Text>
                        <Text color="muted">
                          {act.userId
                            ? ""
                            : act.ownerId
                            ? "Pet Owner"
                            : "Pet Seeker"}
                        </Text>
                      </Box>
                    </HStack>
                    <Text color="muted">{act.createdAt}</Text>
                  </Stack>
                  <Text
                    color="muted"
                    sx={{
                      "-webkit-box-orient": "vertical",
                      "-webkit-line-clamp": "2",
                      overflow: "hidden",
                      display: "-webkit-box",
                    }}
                  >
                    {act.description}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
