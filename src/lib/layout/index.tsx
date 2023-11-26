import {
  Box,
  Container,
  Flex,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";

// import Footer from "./Footer";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import RouteGuard from "lib/components/auth/RouteGuard";
import { Navbar } from "lib/layout/Navbar";
import Header from "../components/nav/Header";
import Services from "lib/pages/services";
import { Sidebar } from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const publicLinks = ["/", "/breeds", "/blog"];
  const authLinks = ["/login", "/signup"];
  const privateLinks = [
    "/home",
    "/services",
    "/account/pets",
    "/account/profile",
    "/account/settings",
  ];

  return (
    <Box margin="0 auto" w="full" h="100vh" transition="0.5s ease-out">
      <Box h="full">
        {publicLinks.includes(router.pathname) ||
        router.pathname.includes("blog") ||
        (authLinks.includes(router.pathname) && isMobile) ? (
          <Header />
        ) : privateLinks.includes(router.pathname) && isMobile ? (
          <Navbar />
        ) : (
          <></>
        )}

        {privateLinks.includes(router.pathname) ? (
          <Flex
            as="section"
            direction={{ base: "column", md: "row" }}
            h={{ base: "calc(100vh - 64px)", md: "100vh" }}
            bg="bg-canvas"
            overflowY="auto"
          >
            {isDesktop ? <Sidebar /> : <></>}
            <Box bg="bg-accent" flex="1">
              <Box bg="bg-canvas" height="full">
                <Container py="8" height="full">
                  <>{children}</>
                </Container>
              </Box>
            </Box>
          </Flex>
        ) : (
          <Box as="main" h={{ base: "calc(100vh - 64px)", md: "100vh" }}>
            {!["/login", "/signup", "/profile"].includes(router.pathname) ? (
              <RouteGuard>{children}</RouteGuard>
            ) : (
              <>{children}</>
            )}
          </Box>
        )}

        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
