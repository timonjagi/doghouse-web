import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import NewPostForm from "./NewPostForm";
import Post from "./Post";

const Home = ({ activity }) => {
  const [user, loading, error] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({} as any);

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
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
        router.push("/signup");
      } else {
        const user = await response.json();
        setUserProfile(user.user);
      }
    };

    if (!loading && !user) {
      router.push("/");
    } else if (!loading && user) {
      fetchUserDoc();
      console.log(user);
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
          <Stack spacing="4" direction="row" justify="space-between">
            <Box>
              <Text fontSize="lg" fontWeight="medium">
                Activity feed
              </Text>
              <Text color="muted" fontSize="sm">
                All updates show up here
              </Text>
            </Box>
            <Button variant="primary" alignSelf="start" onClick={onOpen}>
              Post
            </Button>
          </Stack>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="muted" boxSize="5" />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>

          <Box bg="bg-surface" py="4">
            <Stack divider={<StackDivider />} spacing="4">
              {activity.map((act) => (
                <Post post={act} userProfile={userProfile} />
              ))}
            </Stack>
          </Box>
        </Stack>

        <Modal
          onClose={onClose}
          isOpen={isOpen}
          size={{ base: "xs", md: "sm" }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <NewPostForm></NewPostForm>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default Home;
