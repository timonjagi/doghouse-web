import { Box, useBreakpointValue, useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";

// import Footer from "./Footer";
import Header from "./Header";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import RouteGuard from "lib/components/auth/RouteGuard";

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
        {!["/login", "/signup", "/profile"].includes(router.pathname) ||
        isMobile ? (
          <Header />
        ) : (
          <></>
        )}
        <Box
          as="main"
          h={useBreakpointValue({ base: "calc(100vh - 64px)", md: "100vh" })}
        >
          <RouteGuard>{children}</RouteGuard>
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
