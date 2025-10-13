import {
  Container,
  Flex,
  Stack,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { auth, fireStore } from "lib/firebase/client";
import { doc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import ChatSidebar from "../../../lib/pages/inbox/ChatSidebar";
import ChatInputBox from "../../../lib/pages/inbox/ChatInputBox";
import ChatHeader from "../../../lib/pages/inbox/ChatHeader";
import ChatBox from "../../../lib/pages/inbox/ChatBox";
import { Loader } from "../../../lib/components/Loader";

export default function Chatroom() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const { chatId } = router.query;
  const lastMessage = useRef(null);
  const [chatDataDoc, loadingChatDoc, errorLoadingChatDoc] = useDocument(
    doc(fireStore, "chats", chatId.toString())
  );
  const [chatData, setChatData] = useState(null);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loadingChatDoc && !errorLoadingChatDoc) {
      setChatData({ ...chatDataDoc.data(), id: chatDataDoc.id });
    }
  }, [chatDataDoc, loadingChatDoc, errorLoadingChatDoc]);

  return (
    <Container>
      <Stack>
        {!isMobile && <ChatSidebar />}

        {loadingChatDoc && !errorLoadingChatDoc && (
          <Flex direction="column" flexGrow="1" height="100vh" maxWidth="100%">
            <Loader />
          </Flex>
        )}

        <Flex direction="column" flexGrow="1" height="100vh" maxWidth="100%">
          {chatData && user && (
            <ChatHeader
              id={chatId.toString()}
              chatData={chatData}
              user={user}
            />
          )}

          <ChatBox scrollRef={lastMessage} id={chatId.toString()} />

          <ChatInputBox scrollRef={lastMessage} id={chatId.toString()} />
        </Flex>
      </Stack>
    </Container>
  );
}
