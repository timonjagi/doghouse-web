import { useBreakpointValue, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Header from "./Header";
import { ReactNode } from "react";
import Footer from "./Footer";


type LayoutProps = {
  children: ReactNode;
};
export const HeaderFooterLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box
        as="main"
        flex="1"
        overflow="auto"
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
