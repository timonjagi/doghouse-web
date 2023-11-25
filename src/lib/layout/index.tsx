import { Box, useBreakpointValue, useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";

// import Footer from "./Footer";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import RouteGuard from "lib/components/auth/RouteGuard";
import { Navbar } from "lib/pages/home/Navbar";
import Header from "../components/nav/Header";

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
        {["/"].includes(router.pathname) ||
        (["/login", "/signup"].includes(router.pathname) && isMobile) ? (
          <Header />
        ) : ["/dashboard"].includes(router.pathname) && isMobile ? (
          <Navbar />
        ) : (
          <></>
        )}
        <Box
          as="main"
          h={useBreakpointValue({ base: "calc(100vh - 64px)", md: "100vh" })}
        >
          {!["/login", "/signup", "/profile"].includes(router.pathname) ? (
            <RouteGuard>{children}</RouteGuard>
          ) : (
            <>{children}</>
          )}
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
