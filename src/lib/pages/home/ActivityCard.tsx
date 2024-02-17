import {
  Stack,
  HStack,
  Avatar,
  Box,
  Text,
  Button,
  Divider,
  Spacer,
  useBreakpointValue,
  useToast,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, fireStore } from "lib/firebase/client";
import moment from "moment";
import React, { useState } from "react";
import {
  FiBellOff,
  FiMessageSquare,
  FiMoreVertical,
  FiUser,
} from "react-icons/fi";
import router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

type ActivityCardProps = {
  post: any;
  onViewPost: any;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ post, onViewPost }) => {
  const [user] = useAuthState(auth);
  const toast = useToast();

  const ownPost = [post.userId, post.ownerId, post.seekerId].includes(
    user?.uid
  );

  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const [chatValues, loading, error] = useCollection(
    query(
      collection(fireStore, "chats"),
      where("users", "array-contains", user.uid)
    )
  );

  const onSearch = () => {};

  const onFilter = () => {};

  const onSort = () => {};

  const onDeleteOwn = () => {};

  const onLike = async () => {
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
      toast({
        title: "Error liking post",
        description: error.message,
        status: "error",
      });
    }
  };

  const onSendMessage = async () => {
    setIsCreatingChat(true);
    if (!loading && !error && chatValues) {
      const chats = chatValues?.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // @ts-ignore
      let existingChat = chats.find((chat) => chat.users.includes(user.uid));

      if (existingChat) {
        console.log("existing chat", existingChat);
        return router.push(`/inbox/${existingChat.id}`);
      }
    }

    try {
      const chatDocRef = await addDoc(collection(fireStore, "chats"), {
        users: [user.uid, post.seekerId ? post.seekerId : post.ownerId],
        lastSent: serverTimestamp(),
      });

      console.log(chatDocRef);
      router.push(`/inbox/${chatDocRef.id}`);
    } catch (error: any) {
      toast({
        title: error.message,
        status: "error",
      });
    }
    setIsCreatingChat(false);
  };

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
    <Box w="full">
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
              color={post.title === "Pet added" ? "primary" : "secondary"}
              size="sm"
            >
              {post.title === "Pet added" ? "Listing" : "Request"}
            </Badge>
            <HStack spacing="3">
              {!ownPost && (
                <IconButton
                  icon={<FiMessageSquare />}
                  aria-label="Send Message"
                  size="sm"
                  color="blackAlpha.700"
                  onClick={onSendMessage}
                  isLoading={isCreatingChat}
                />
              )}

              {!ownPost && (
                <IconButton
                  icon={<FiUser />}
                  aria-label="View User"
                  size="sm"
                />
              )}

              {!ownPost && (
                <IconButton
                  icon={<FiBellOff />}
                  aria-label="Send Message"
                  size="sm"
                ></IconButton>
              )}
            </HStack>
          </HStack>
        </Stack>
      </Stack>

      <Divider />
    </Box>
  );
};
export default ActivityCard;
