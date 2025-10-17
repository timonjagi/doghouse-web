import { Container } from "@chakra-ui/react";
import React from "react";
import ChatSidebar from "./ChatSidebar";

type indexProps = {
  children: any;
};

const index: React.FC<indexProps> = ({ children }) => {
  return (
    <Container alignItems="flex-start" height="100vh">
      {/* <ChatSidebar /> */}

      {children}
    </Container>
  );
};
export default index;
