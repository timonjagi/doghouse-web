import {
  Container,
  Flex,
  Stack,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { auth, fireStore } from "lib/firebase/client";
import { doc } from "firebase/firestore";
import React, { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import ChatSidebar from "../../../lib/pages/inbox/ChatSidebar";
import ChatInputBox from "../../../lib/pages/inbox/ChatInputBox";
import ChatHeader from "../../../lib/pages/inbox/ChatHeader";
import ChatBox from "../../../lib/pages/inbox/ChatBox";

export default function Chatroom() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { chatId } = router.query;
  const lastMessage = useRef(null);
  const [chatData] = useDocumentData(
    doc(fireStore, "chats", chatId.toString())
  );

  return (
    <Container>
      <Stack>
        {!isMobile && <ChatSidebar />}

        <Flex direction="column" flexGrow="1" height="100vh" maxWidth="100%">
          {chatData && <ChatHeader chatData={chatData} user={user} />}

          {chatId && (
            <ChatBox
              scrollRef={lastMessage}
              chatType="chats"
              id={chatId.toString()}
            />
          )}

          {chatId && (
            <ChatInputBox
              scrollRef={lastMessage}
              id={chatId.toString()}
              chatType="chats"
            />
          )}
        </Flex>
      </Stack>
    </Container>
  );
}
