import { Box, useBreakpointValue } from "@chakra-ui/react";
import type { ReactNode } from "react";

// import Footer from "./Footer";
import Header from "./Header";
import { useRouter } from "next/router";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Box margin="0 auto" w="full" h="100vh" transition="0.5s ease-out">
      <Box h="full">
        {!["/login", "/signup"].includes(router.pathname) || isMobile ? (
          <Header />
        ) : (
          <></>
        )}
        <Box
          as="main"
          h={useBreakpointValue({ base: "calc(100vh - 64px)", md: "100vh" })}
        >
          {children}
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
