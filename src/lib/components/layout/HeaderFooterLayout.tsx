import { useBreakpointValue, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Header from "./Header";
import { ReactNode } from "react";
import Footer from "./Footer";


type LayoutProps = {
  children: ReactNode;
};
export const HeaderFooterLayout: React.FC<LayoutProps> = ({ children }) => {
  const headerHeight = useBreakpointValue({ base: "56px", md: "64px" });

  return (
    <>
      <Header />
      <Box
        as="main"
        h={{ base: `calc(100dvh - ${headerHeight})`, md: "100%" }}
        overflow="scroll"
      >
        {children}

      </Box>
      <Footer />

    </>
  );
};
