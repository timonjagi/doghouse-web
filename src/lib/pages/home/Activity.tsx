import {
  Stack,
  HStack,
  Avatar,
  AvatarBadge,
  Box,
  Text,
  useColorModeValue,
  Button,
  Divider,
  Flex,
  Icon,
  Spacer,
  useBreakpointValue,
  useToast,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "lib/firebase/client";
import moment from "moment";
import React, { useState } from "react";
import {
  FiBellOff,
  FiGitlab,
  FiHeart,
  FiMapPin,
  FiMessageSquare,
  FiMoreVertical,
  FiSettings,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import PetCard from "../account/pets/PetCard";
import router from "next/router";

type PostProps = {
  post: any;
  userProfile: any;
  onViewPost: any;
};

const Post: React.FC<PostProps> = ({ post, userProfile, onViewPost }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const ownPost = [post.userId, post.ownerId, post.seekerId].includes(
    userProfile.userId
  );

  const isMobile = useBreakpointValue({
    base: true,
    sm: false,
  });

  const onSearch = () => {};

  const onFilter = () => {};

  const onSort = () => {};

  const onDelete = () => {};

  const onLike = async () => {
    setLoading(true);
    try {
      const activityDocRef = doc(fireStore, "activity", post.id as string);
      await updateDoc(activityDocRef, {
        likeCount: post.likeCount + 1,
      });

      post.likeCount = post.likeCount + 1;

      toast({
        title: "Post liked successfully",
        status: "success",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error liking post",
        description: error.message,
        status: "error",
      });
    }
  };

  const onMakeOffer = () => {};

  function getHighlightedText(text, highlight) {
    // Split text on highlight term, include term itself into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <b>
              <a style={{ color: "#AC8A65" }} href={`/breeds/${post.petBreed}`}>
                {part}
              </a>
            </b>
          ) : (
            part
          )
        )}
      </span>
    );
  }

  return (
    <Box borderRadius="lg" w="full">
      <Stack key={post.id} fontSize="sm" p="4" spacing="4">
        <Stack direction="row" justify="space-between" spacing="2">
          <Stack direction="row" justify="space-between" w="full" align="start">
            <HStack>
              <Avatar />
              <Stack spacing="1">
                <Text fontWeight="medium" color="emphasized">
                  {post.petBreed}
                </Text>
                <HStack>
                  <Text color="subtle">
                    {post.petAge}, {post.petSex}
                  </Text>
                </HStack>
              </Stack>
            </HStack>

            <Spacer />

            <HStack>
              <Text color="muted" fontSize="12">
                {moment(post.createdAt).fromNow()}
              </Text>
              <IconButton
                icon={<FiMoreVertical />}
                onClick={() => {}}
                aria-current={
                  router.pathname.includes("account/settings")
                    ? "page"
                    : "false"
                }
                aria-label="Settings"
                variant="ghost"
                size="sm"
              />
            </HStack>
          </Stack>
        </Stack>
        <Stack shouldWrapChildren spacing="4" pr="4">
          <HStack justify="space-between">
            <Badge
              colorScheme={post.title === "Pet added" ? "green" : "blue"}
              size="sm"
            >
              {post.title === "Pet added" ? "Listing" : "Request"}
            </Badge>
            <HStack spacing="3">
              {/* <Text
                fontSize="xs"
                color="subtle"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {post.userName}
              </Text> */}
              <IconButton icon={<FiUser />} aria-label="View User" size="sm" />

              <IconButton
                icon={<FiMessageSquare />}
                aria-label="Send Message"
                size="sm"
              ></IconButton>

              <IconButton
                icon={<FiBellOff />}
                aria-label="Send Message"
                size="sm"
              ></IconButton>
            </HStack>
          </HStack>
        </Stack>
      </Stack>

      <Divider />
    </Box>
  );
};
export default Post;
