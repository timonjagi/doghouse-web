import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { doc } from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { fireStore } from "../../firebase/client";

export default function ChatHeader({ chatData, user }: any) {
  const { colorMode } = useColorMode();
  const router = useRouter();
  console.log(chatData);
  const chatPartnerId = chatData?.users?.find((userId) => userId !== user.uid);
  console.log("chat partner id", chatPartnerId);
  const [chatPartner] = useDocumentData(doc(fireStore, "users", chatPartnerId));

  console.log(chatPartner);
  const timeAgo = moment(chatPartner?.lastActive).fromNow();

  return (
    <>
      {chatPartner && (
        <Flex
          align="center"
          width="100%"
          height="71px"
          p="10px"
          overflow="hidden"
          borderBottom="1px solid"
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
          maxWidth="100%"
        >
          <IconButton
            aria-label="Go Back"
            icon={<ArrowBackIcon />}
            mr="10px"
            size="md"
            onClick={() => router.push("/")}
            isRound
          />
          <Avatar
            mr={4}
            name={chatPartner?.name}
            src={chatPartner?.profilePhotoUrl}
          />

          <Box maxWidth="70%">
            <Heading size="md" isTruncated>
              {chatPartner.name}
            </Heading>
            <Text>Last Active: {timeAgo}</Text>
          </Box>
        </Flex>
      )}
    </>
  );
}
