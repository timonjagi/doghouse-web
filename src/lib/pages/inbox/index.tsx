import { Container } from "@chakra-ui/react";
import React from "react";
import ChatSidebar from "./ChatSidebar";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  return (
    <Container alignItems="flex-start" height="100vh">
      <ChatSidebar />
    </Container>
  );
};
export default index;
