import {
  Avatar,
  Card,
  Flex,
  Spinner,
  Stack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SingleChat from "./SingleChat";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, fireStore } from "../../firebase/client";
import { Loader } from "../../components/ui/Loader";

type ChatSidebarProps = {};

const ChatSidebar: React.FC<ChatSidebarProps> = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [user, loadingUser, errorLoadingUser] = useAuthState(auth);
  const [chats, setChats] = useState([]);
  const [chatValues, loading, error] = useCollection(
    query(
      collection(fireStore, "chats"),
      where("users", "array-contains", user.uid)
    )
  );
  useEffect(() => {
    if (!loading && chatValues) {
      if (chatValues) {
        setChats(
          chatValues?.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        console.log(chats);
      }
    }
  }, [loading, chatValues]);

  return (
    <>
      {loading && (
        <Flex direction="column" flexGrow="1" height="100vh" maxWidth="100%">
          <Loader />
        </Flex>
      )}

      {!loading && !error && (
        <Flex
          as={Card}
          bg="bg-zinc-800"
          height="100vh"
          maxWidth={isMobile ? "100vw" : "xs"}
          width={isMobile ? "100vw" : "auto"}
          direction="column"
        >
          <Flex flexWrap="wrap" direction="column" position="sticky" top="0">
            <Flex justify="space-between" height="71px" align="center" p="10px">
              <Avatar src={user.photoURL} />
            </Flex>
          </Flex>

          {loading && <Spinner />}
          {!loading && (
            <Stack direction="column" overflow="scroll">
              {chatValues?.docs.map((chat) => (
                <SingleChat
                  key={chat.id}
                  id={chat.id}
                  users={chat.data().users}
                />
              ))}
            </Stack>
          )}
        </Flex>
      )}
    </>
  );
};
export default ChatSidebar;
