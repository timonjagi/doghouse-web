import { useRouter } from "next/router";
import RouteGuard from "lib/components/auth/RouteGuard";
import { Navbar } from "lib/components/layout/Navbar";
import Header from "./Header";

import { Sidebar } from "./Sidebar";
import {
  useBreakpointValue,
  Flex,
  Container,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useUserProfile } from "lib/hooks/queries";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const routes: any = [
    { path: "/", layout: HeaderLayout },
    { path: "/breeder", layout: HeaderLayout },
    { path: "/login", layout: HeaderLayout },
    { path: "/signup", layout: HeaderLayout },
    { path: "/onboarding", layout: HeaderLayout },
    { path: "/breeds", layout: HeaderLayout },
    { path: "/breeds/[breedName]", layout: HeaderLayout },
    { path: "/contact", layout: HeaderLayout },
    { path: "/about", layout: HeaderLayout },
    { path: '/blog', layout: HeaderLayout },
    { path: '/blog/[slug]', layout: HeaderLayout },
    { path: "/terms", layout: HeaderLayout },
    { path: "/privacy", layout: HeaderLayout },

    // Dashboard routes
    { path: "/dashboard", layout: DashboardLayout },
    { path: "/dashboard/inbox", layout: DashboardLayout },
    { path: "/dashboard/inbox/[chatId]", layout: DashboardLayout },
    { path: "/dashboard/breeds", layout: DashboardLayout },
    { path: "/dashboard/breeds/[id]", layout: DashboardLayout },
    { path: "/dashboard/listings", layout: DashboardLayout },
    { path: "/dashboard/listings/[id]", layout: DashboardLayout },
    { path: "/dashboard/matches", layout: DashboardLayout },
    { path: "/dashboard/applications", layout: DashboardLayout },
    { path: "/dashboard/profile", layout: DashboardLayout },
    { path: "/dashboard/settings", layout: DashboardLayout },

    // Admin dashboard routes
    { path: "/dashboard/admin", layout: DashboardLayout },
    { path: "/dashboard/admin/verification", layout: DashboardLayout },
    { path: "/dashboard/admin/users", layout: DashboardLayout },
    { path: "/dashboard/admin/listings", layout: DashboardLayout },
    { path: "/dashboard/admin/analytics", layout: DashboardLayout },
    { path: "/dashboard/admin/profile", layout: DashboardLayout },

    // Legacy routes (for backward compatibility)

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
    //router.replace('/404');
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
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  return (
    <>
      {(!["/login", "/signup", "/onboarding"].includes(router.pathname) || isMobile) && <Header profile={profile} />}
      <Box as="main" h={{ base: "calc(100vh - 64px)", md: "100vh" }}>
        {children}{" "}
      </Box>
    </>
  );
};

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { onClose } = useDisclosure();

  const { data: profile, isLoading: profileLoading } = useUserProfile();

  return (
    <>
      {isMobile && <Navbar />}
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
        {isDesktop &&
          <Sidebar
            profile={profile}
            onClose={onClose}
          />
        }

        <Box bg="bg-canvas" flex="1" overflow="auto" w="full">
          <Box height="full">
            {isDesktop && <Navbar />}
            <RouteGuard>{children}</RouteGuard>
          </Box>
        </Box>
      </Flex>
    </>
  );
};
