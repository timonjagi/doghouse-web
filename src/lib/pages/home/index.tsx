import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import NewPostForm from "./NewPostForm";
import Post from "./Post";
import PostDetails from "./PostDetails";
import ActivityCard from "./ActivityFeedCard";
import { NavButton } from "lib/layout/NavButton";
import { FiUser, FiGitlab, FiSettings } from "react-icons/fi";
import CompleteProfileCTA from "./EthicalQuestionairreCard";
import EthicalQuestionairreCard from "./EthicalQuestionairreCard";
import { CompleteProfileBanner } from "./CompleteProfileBanner";

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

  const onClickMenuLink = (link) => {};

  return (
    <>
      <HStack justify="space-between" align="start">
        <Heading pb="8" size={{ base: "xs", sm: "md" }}>
          Hi, {user.displayName} 👋
        </Heading>

        <HStack spacing="1" direction="row">
          <IconButton
            aria-label='"'
            icon={<FiUser />}
            aria-current={
              router.pathname.includes("account/profile") ? "page" : "false"
            }
            onClick={() => onClickMenuLink("/account/profile")}
          />
          <IconButton
            icon={<FiGitlab />}
            aria-label="Pets"
            aria-current={
              router.pathname.includes("account/pets") ? "page" : "false"
            }
            onClick={() => onClickMenuLink("/account/pets")}
          />
          <IconButton
            icon={<FiSettings />}
            onClick={() => onClickMenuLink("/account/settings")}
            aria-current={
              router.pathname.includes("account/settings") ? "page" : "false"
            }
            aria-label="Settings"
          />
        </HStack>
      </HStack>

      <Stack
        direction={{ base: "column-reverse", lg: "row" }}
        spacing={{ base: "5", lg: "8" }}
        justify="space-between"
      >
        <Flex flex="1" direction="column" py="4">
          <CompleteProfileBanner />

          <EthicalQuestionairreCard />
        </Flex>

        <Flex>
          <ActivityCard
            activity={activity}
            userProfile={userProfile}
            isDesktop={isDesktop}
            onViewPost={onViewPost}
            onOpen={onOpen}
          />
          <Flex>
            <Box></Box>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};

export default Home;
