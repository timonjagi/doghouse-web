import { Container, Heading, VStack, Text } from "@chakra-ui/react";
import React from "react";
// import ChatSidebar from "./ChatSidebar";

type indexProps = {
  children: any;
};

const index: React.FC<indexProps> = ({ children }) => {
  return (
    // <Container alignItems="flex-start" height="100vh">
    //   {/* <ChatSidebar /> */}

    //   {children}
    // </Container>

    <Container maxW="7xl" py={{ base: 4, md: 0 }}>
      <VStack spacing={6} align="stretch">
        <Heading size={{ base: "xs", lg: "md" }}>
          Inbox
        </Heading>
        <Text color="gray.600">
          View messages from verified breeders and pet owners. Stay connected and stay updated.
        </Text>
        <Text fontSize="sm" color="gray.500" fontStyle="italic">
          Inbox interface coming soon...
        </Text>
      </VStack>
    </Container>
  );
};
export default index;
