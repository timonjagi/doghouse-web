import { Avatar, Flex, Text, useColorMode } from "@chakra-ui/react";
import { collection, doc, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, fireStore } from "lib/firebase/client";
import { useEffect, useState } from "react";

export default function SingleChat({ key, id, users }: any) {
  const [user] = useAuthState(auth);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [chatPartner, setChatPartner] = useState(null);
  const chatPartnerId = users?.find((userId) => userId !== user.uid);
  const [chatPartnerDoc, loadingChatPartnerDoc, errorLoadingChatPartnerDoc] =
    useDocument(doc(fireStore, "users", chatPartnerId));

  useEffect(() => {
    if (chatPartnerDoc) {
      setChatPartner({ ...chatPartnerDoc, id: chatPartnerDoc.id });
      console.log("chat Partner: ", chatPartnerDoc.data());
    }
  }, [chatPartnerDoc]);

  return (
    <Flex
      align="center"
      p={4}
      cursor="pointer"
      _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.700" }}
      onClick={() => router.push("/inbox/" + id)}
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
