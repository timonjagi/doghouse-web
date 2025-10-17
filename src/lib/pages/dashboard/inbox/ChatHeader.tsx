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
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, fireStore } from "../../../firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { object } from "firebase-functions/v1/storage";

export default function ChatHeader({ chatData, user }: any) {
  const [chatPartner, setChatPartner] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);
  const { colorMode } = useColorMode();
  const router = useRouter();

  const chatPartnerId = chatData?.users?.find((userId) => userId !== user.uid);
  console.log("chat partner id: ", chatPartnerId);
  const [chatPartnerDoc, loadingChatPartner, errorLoadingChatPartner] =
    useDocument(doc(fireStore, "users", chatPartnerId.toString()));

  useEffect(() => {
    if (chatPartnerDoc) {
      setChatPartner({ ...chatPartnerDoc, id: chatPartnerDoc.id });
      setTimeAgo(moment(chatData.createdAt).fromNow());
      console.log("chat Partner: ", chatPartner);
    }
  }, [chatPartnerDoc]);

  return (
    <>
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
          size="xl"
          onClick={() => router.push("/inbox")}
          variant="ghost"
        />
        <Avatar
          mr={4}
          name={chatPartner?.name}
          src={chatPartner?.profilePhotoUrl}
        />

        <Box maxWidth="70%">
          <Heading size="md" isTruncated>
            {chatPartner?.name}
          </Heading>
          <Text>Last Active: {timeAgo}</Text>
        </Box>
      </Flex>
    </>
  );
}
