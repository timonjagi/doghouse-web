import { Box, Text, useColorMode, Flex, VStack } from "@chakra-ui/react";
import { collection, limit, orderBy, query, doc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, fireStore } from "lib/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";

const Message = ({ message, photoURL, id }: any) => {
  const { colorMode } = useColorMode();
  const [user] = useAuthState(auth);
  // @ts-ignore
  const { uid } = user;
  const bgColor = { light: "gray.300", dark: "gray.600" };
  const textColor = { light: "black", dark: "white" };
  return (
    <Box
      flex="1"
      bg={uid == id ? "blue.500" : bgColor[colorMode]}
      w="fit-content"
      py={1}
      px={3}
      rounded="xl"
      margin={2}
      ml={uid == id ? "auto" : "0"}
      position="relative"
      textAlign={uid == id ? "right" : "left"}
      wordBreak="break-word"
      color={uid == id ? "white" : textColor[colorMode]}
    >
      <Text>{message}</Text>
    </Box>
  );
};

export default function ChatBox({ scrollRef, id, chatType }: any) {
  const [messages] = useCollectionData(
    query(
      collection(fireStore, "chats", id, "messages"),
      orderBy("createdAt", "asc")
    )
  );

  return (
    <Flex
      maxW="sm"
      grow="1"
      align="start"
      justify="flex-end"
      direction="column"
      overflowY="scroll"
      p="10px"
    >
      {messages?.map((msg) => (
        <Message
          key={Math.random()}
          id={msg.uid}
          message={msg.Message}
          photoURL={msg.photoURL}
        />
      ))}
      <div ref={scrollRef}></div>
    </Flex>
  );
}
