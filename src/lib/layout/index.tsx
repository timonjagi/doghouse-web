import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "lib/firebase/client";
import RouteGuard from "lib/components/auth/RouteGuard";
import { Navbar } from "lib/layout/Navbar";
import Header from "./Header";
import Services from "lib/pages/services";
import { Sidebar } from "./Sidebar";
import {
  useBreakpointValue,
  Flex,
  Container,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

interface RouteConfig {
  path: string;
  layout: React.ComponentType<LayoutProps>;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const routes: RouteConfig[] = [
    { path: "/", layout: HeaderLayout },

    { path: "/login", layout: HeaderLayout },
    { path: "/signup", layout: HeaderLayout },

    { path: "/home", layout: DashboardLayout },
    { path: "/inbox", layout: DashboardLayout },

    { path: "/breeds", layout: DashboardLayout },
    { path: "/breeds/[breedName]", layout: DashboardLayout },
    { path: "/my-breeds", layout: DashboardLayout },
    { path: "/my-breeds/[petId]", layout: DashboardLayout },

    { path: "/account/profile", layout: DashboardLayout },
    { path: "/account/settings", layout: DashboardLayout },
  ];

  const matchedRoute = routes.find((route) => {
    if (route.path.includes("[")) {
      // If the route has square brackets, treat it as a dynamic route
      const regex = new RegExp(`^${route.path.replace(/\[.*\]/, ".*")}$`);
      return router.pathname.match(regex);
    }
    return route.path === router.pathname;
  });

  if (!matchedRoute) {
    return <div>Route not found</div>; // Handle not found routes
  }

  const { layout: LayoutComponent } = matchedRoute;
  console.log("matched route", matchedRoute);
  return (
    <Box margin="0 auto" w="full" h="100vh" transition="0.5s ease-out">
      <Box h="full">
        <LayoutComponent>{children}</LayoutComponent>
      </Box>
    </Box>
  );
};

export default Layout;

// Separate layout components based on your needs
const HeaderLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {["/login", "/signup"].includes(router.pathname) ? (
        <>
          {isMobile && <Header />}
          <Box as="main" h={{ base: "calc(100vh - 64px)", md: "100vh" }}>
            {children}{" "}
          </Box>
        </>
      ) : (
        <>
          <Header />
          <Box as="main" h={{ base: "calc(100vh - 64px)", md: "100vh" }}>
            <RouteGuard>{children}</RouteGuard>
          </Box>
        </>
      )}
    </>
  );
};

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      {isMobile ? <Navbar /> : <></>}
      <Flex
        as="section"
        direction={{ base: "column", md: "row" }}
        bg="bg-canvas"
        overflow="auto"
        w="100vw"
        h={{ base: "calc(100vh - 64px)", md: "100vh" }}
        maxH="100vh"
        maxW="100vw"
      >
        {isDesktop ? (
          <>
            <Sidebar onClose={onClose} />
          </>
        ) : (
          <></>
        )}

        <Box bg="bg-canvas" flex="1" overflow="auto" w="full">
          <Box height="full">
            <Container py="8" height="full">
              <RouteGuard>{children}</RouteGuard>
            </Container>
          </Box>
        </Box>
      </Flex>
    </>
  );
};
