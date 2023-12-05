import {
  Flex,
  HStack,
  Heading,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ActivityCard from "./ActivityFeedCard";
import { FiUser, FiSettings, FiBell } from "react-icons/fi";
import { NewsletterForm } from "./NewsletterForm";
import { ExploreBreeds } from "./ExploreBreeds";
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
        <Heading pb="4" size={{ base: "xs", sm: "md" }}>
          Hi, {user.displayName} 👋
        </Heading>

        <HStack spacing="1" direction="row">
          {isDesktop && (
            <IconButton
              icon={<FiBell />}
              aria-label="Pets"
              aria-current={
                router.pathname.includes("account/pets") ? "page" : "false"
              }
              onClick={() => onClickMenuLink("/account/pets")}
            />
          )}
          <IconButton
            aria-label='"'
            icon={<FiUser />}
            aria-current={
              router.pathname.includes("account/profile") ? "page" : "false"
            }
            onClick={() => onClickMenuLink("/account/profile")}
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
      {/* <NewsletterForm /> */}

      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "5", lg: "8" }}
        justify="space-between"
      >
        <Stack
          spacing="4"
          flex="1"
          direction="column"
          w={{ base: "full", lg: "lg" }}
          minW="sm"
        >
          <ActivityCard
            activity={activity}
            userProfile={userProfile}
            isDesktop={isDesktop}
            onViewPost={onViewPost}
            onOpen={onOpen}
          />
        </Stack>

        <Flex direction="column" flex="1" maxW={{ base: "none", lg: "sm" }}>
          <CompleteProfileBanner />
          <NewsletterForm />
        </Flex>
      </Stack>
    </>
  );
};

export default Home;
