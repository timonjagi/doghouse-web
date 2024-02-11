import { Avatar, Flex, Text, useColorMode } from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, fireStore } from "lib/firebase/client";

export default function SingleChat({ users, id }: any) {
  const [user] = useAuthState(auth);
  const { colorMode } = useColorMode();
  const router = useRouter();
  // @ts-ignore
  const chatPartner = users?.find((user) => user.userId !== user.uid);
  const handleClick = () => {
    router.push(`/inbox/${id}`);
  };

  return (
    <Flex
      align="center"
      p={4}
      cursor="pointer"
      _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.700" }}
      onClick={handleClick}
    >
      <Avatar
        mr={4}
        name={chatPartner?.name}
        src={chatPartner?.profilePhotoUrl}
      />
      <Text>{chatPartner?.name}</Text>
    </Flex>
  );
}
