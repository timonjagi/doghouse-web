import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Container,
  Flex,
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
import PostDetails from "./PostDetails";

const Home = ({ activity }) => {
  const [user, loading, error] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState({} as any);
  const [selectedPost, setSelectedPost] = useState();

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });

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

  const onViewPost = (post) => {
    setSelectedPost(post);
  };

  return (
    <Box
      as="section"
      pt={{ base: "4", md: "8" }}
      pb={{ base: "12", md: "24" }}
      overflowY="scroll"
    >
      <Container>
        <NextSeo title="Home" />

        <Flex flex="1">
          <Flex maxW={{ base: "unset", md: "sm" }}>
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
              {/* 
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="muted" boxSize="5" />
                </InputLeftElement>
                <Input placeholder="Search" />
              </InputGroup> */}

              <Box py="4">
                <Stack spacing="4">
                  {activity.map((act) => (
                    <Post
                      post={act}
                      userProfile={userProfile}
                      onViewPost={() => (isDesktop ? onViewPost(act) : onOpen)}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Flex>

          {selectedPost && isDesktop ? (
            <Flex flex="1">
              <PostDetails
                selectedPost={selectedPost}
                userProfile={userProfile}
              />
            </Flex>
          ) : (
            <Modal
              onClose={onClose}
              isOpen={isOpen}
              size={{ base: "xs", md: "sm" }}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                  <PostDetails
                    selectedPost={selectedPost}
                    userProfile={userProfile}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </Flex>

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
